import { Prisma, type Catalog } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const catalogRouter = createTRPCRouter({
  getCatalogs: protectedProcedure.query(({ ctx }) => {
    const { id } = ctx.session.user;
    const result: Prisma.PrismaPromise<Catalog[]> = ctx.prisma.catalog.findMany(
      {
        where: {
          User: {
            id: id,
          },
        },
      }
    );
    return result;
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

        console.log(session.user.id);

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
          data: {
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
