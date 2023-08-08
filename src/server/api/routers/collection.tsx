import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { env } from "~/env.mjs";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const bucketName = env.AWS_BUCKET_NAME;
const cloudFrontUrl = env.CLOUDFRONT_URL;
const region = env.AWS_BUCKET_REGION;
const accessKeyId = env.AWS_MATMINNET_ACCESS_KEY;
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const collectionRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!collection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the collection does not exist",
        });
      }

      const imageName = uuidv4();
      await ctx.prisma.collection.update({
        where: {
          id: collection.id,
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

  getCollections: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    try {
      const collections = await ctx.prisma.collection.findMany({
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
          _count: true,
        },
      });

      if (collections) {
        collections?.forEach((collection) => {
          collection.image?.forEach((image) => {
            const signedUrl = getSignedUrl({
              keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
                /\\n/gm,
                "\n"
              ) as string,
              url: cloudFrontUrl + image.name,
              dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
            });
            image.name = signedUrl;
          });
        });
      }
      return collections;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }),

  getCollectionWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      try {
        const collection = await ctx.prisma.collection.findFirst({
          where: {
            id: input.id,
          },
        });

        if (session.user.id === collection?.userId) {
          return collection;
        }

        return null;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }),

  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = ctx.session.user;
      try {
        const collection = await ctx.prisma.collection.create({
          data: {
            userId: id,
            name: input.name,
            type: input.type,
          },
        });
        return {
          status: "success",
          response: {
            collection,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "collection with that title already exists",
            });
          }
        }
        throw error;
      }
    }),

  deleteCollectionWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.collection.delete({
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
              message: "collection with that ID not found",
            });
          }
        }
        throw error;
      }
    }),

  updateCollection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const collection = await ctx.prisma.collection.update({
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
            collection,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Collection with that ID not found",
            });
          }
        }
        throw error;
      }
    }),
});
