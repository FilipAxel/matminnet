import { type Author, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getAllRecipes: protectedProcedure.query(({ ctx }) => {
    const { id } = ctx.session.user;
    if (!id) return;
    const recipes = ctx.prisma.recipe.findMany({
      where: {
        userId: id,
      },
    });

    return recipes;
  }),

  getApprovedPublication: publicProcedure.query(async ({ ctx }) => {
    try {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          publicationStatus: "published",
        },
      });
      return recipes;
    } catch (error) {}
  }),

  getRecipeWithCatalogId: protectedProcedure
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

  getRecipeWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const recipeId: string = input.id;

      try {
        const recipes = await ctx.prisma.recipe.findFirst({
          where: {
            id: recipeId,
          },
          include: {
            author: true,
            RecipeIngredient: {
              include: {
                ingredient: true,
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
        recipe: z.object({
          name: z.string(),
          description: z.string(),
          direction: z.string(),
          servingSize: z.string(),
          video: z.string(),
          country: z.string(),
          author: z.string(),
          catalog: z.object({
            value: z.string(),
            label: z.string(),
          }),
          ingredients: z.array(
            z.object({
              value: z.string(),
              label: z.string(),
              quantity: z.string(),
              unit: z.string(),
            })
          ),
          publicationStatus: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.session.user;
      const { recipe } = input;
      const {
        author,
        catalog,
        country,
        description,
        direction,
        ingredients,
        name,
        servingSize,
        video,
        publicationStatus,
      } = recipe;

      try {
        const authorFromDb = await ctx.prisma.author.findFirst({
          where: {
            name: author,
          },
        });

        const catalogFromDb = await ctx.prisma.catalog.findFirst({
          where: {
            name: catalog?.value,
          },
        });

        let createdAuthor: Author | null = null;
        if (!authorFromDb) {
          createdAuthor = await ctx.prisma.author.create({
            data: {
              name: author,
            },
          });
        }

        const recipeIngredients: {
          name: string;
          quantity: string;
          unit: string;
          ingredientId: string;
        }[] = [];
        for (const ingredient of ingredients) {
          const existingIngredient = await ctx.prisma.ingredient.findUnique({
            where: {
              name: ingredient.value,
            },
          });

          if (existingIngredient) {
            recipeIngredients.push({
              name: ingredient.value,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              ingredientId: existingIngredient.id,
            });
          } else {
            const newIngredient = await ctx.prisma.ingredient.create({
              data: {
                name: ingredient.value,
              },
            });

            recipeIngredients.push({
              name: ingredient.value,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              ingredientId: newIngredient.id,
            });
          }
        }

        const createdRecipe = await ctx.prisma.recipe.create({
          data: {
            name: name,
            description: description,
            direction: direction,
            country: country,
            servingSize: parseInt(servingSize),
            video: video,
            authorId: authorFromDb?.id || createdAuthor?.id,
            userId: id,
            catalogs: {
              create: {
                catalog: {
                  connect: {
                    id: catalogFromDb?.id,
                  },
                },
              },
            },
            RecipeIngredient: {
              create: recipeIngredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                ingredient: {
                  connect: {
                    id: ingredient.ingredientId,
                  },
                },
              })),
            },
            publicationStatus: publicationStatus
              ? "pending approval"
              : "private",
          },
          include: {
            RecipeIngredient: true, // Include the created ingredients in the response
          },
        });

        if (publicationStatus) {
          await ctx.prisma.recipePublicationRequest.create({
            data: {
              recipeId: createdRecipe.id,
              userId: id,
            },
          });
        }

        return {
          status: "success",
          createdRecipe,
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
