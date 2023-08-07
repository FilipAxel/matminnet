import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { Prisma, type Catalog } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const bucketName = process.env.AWS_BUCKET_NAME || "";
const cloudFrontUrl = process.env.CLOUDFRONT_URL || "";
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_MATMINNET_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const catalogRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const catalog = await ctx.prisma.catalog.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!catalog) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the catalog does not exist",
        });
      }

      const imageName = uuidv4();
      await ctx.prisma.catalog.update({
        where: {
          id: catalog.id,
        },
        data: {
          image: {
            create: {
              name: imageName,
            },
          },
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: bucketName,
        Key: imageName,
        Fields: {
          key: imageName,
        },
        Expires: 60,
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),

  getCatalogs: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    try {
      const catalogs = await ctx.prisma.catalog.findMany({
        where: {
          User: {
            id: id,
          },
        },
        include: {
          image: {
            select: {
              name: true,
            },
          },
        },
      });

      if (catalogs) {
        catalogs?.forEach((catalog) => {
          catalog.image?.forEach((image) => {
            const signedUrl = getSignedUrl({
              keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY as string,
              url: cloudFrontUrl + image.name,
              dateLessThan: new Date(
                Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
              ).toString(),
            });
            image.name = signedUrl;
          });
        });
      }
      return catalogs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }),

  getCatalogWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      try {
        const catalog = await ctx.prisma.catalog.findFirst({
          where: {
            id: input.id,
          },
        });

        if (session.user.id === catalog?.userId) {
          return catalog;
        }

        return null;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }),

  createCatalog: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = ctx.session.user;
      try {
        const catalog = await ctx.prisma.catalog.create({
          data: {
            userId: id,
            name: input.name,
            type: input.type,
          },
        });
        return {
          status: "success",
          response: {
            catalog,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Catalog with that title already exists",
            });
          }
        }
        throw error;
      }
    }),

  deleteCatalogWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.catalog.delete({
          where: {
            id: input.id,
          },
        });
        return {
          status: "success",
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Catalog with that ID not found",
            });
          }
        }
        throw error;
      }
    }),

  updateCatalog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const catalog = await ctx.prisma.catalog.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
        });
        return {
          status: "success",
          data: {
            catalog,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Catalog with that ID not found",
            });
          }
        }
        throw error;
      }
    }),
});
