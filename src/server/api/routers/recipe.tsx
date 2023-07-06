import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const catalogId: string = input.id;

      try {
        const recipes = await ctx.prisma.recipe.findMany({
          where: {
            catalogs: {
              some: {
                catalog: {
                  id: catalogId,
                },
              },
            },
          },
        });
        return recipes;
      } catch (error) {}
    }),

  createRecipe: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        catalogId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.recipe.create({
          data: {
            name: input.name,
            catalogs: {
              create: {
                catalog: {
                  connect: {
                    id: input.catalogId,
                  },
                },
              },
            },
          },
        });
        return {
          status: "success",
        };
      } catch (error) {
        throw error;
      }
    }),

  updateRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const recipe = await ctx.prisma.recipe.update({
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
            recipe,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Recipe with that ID not found",
            });
          }
        }
        throw error;
      }
    }),

  deleteRecipeWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.recipe.delete({
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
});
