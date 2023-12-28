import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getSignedUrlAws } from "~/server/controller/aws.controller";
import { Prisma } from "@prisma/client";

export const searchRouter = createTRPCRouter({
  searchRecipe: publicProcedure
    .input(
      z.object({
        query: z.string(),
        filters: z.object({
          tags: z.array(z.string()).optional(),
          countries: z.array(z.string()).optional(),
          cookingTime: z.number().optional(),
          collection: z.string().optional(),
        }),
        publication: z.string().optional(),
        publicSearch: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { query, filters, publication, publicSearch } = input;

      try {
        if (query.length === 0) {
          // const recipesCount = await ctx.prisma.recipe.count();
          //const skip = Math.floor(Math.random() * recipesCount);
          const randomRecipes = await ctx.prisma.recipe.findMany({
            take: 10,
            /*    skip: skip, */
            where: {
              ...(!publicSearch
                ? {
                    userId: ctx?.session?.user.id,
                  }
                : {}),
              ...(publication
                ? {
                    publicationStatus: publication,
                  }
                : {}),
              AND: {
                cookingTime: filters.cookingTime
                  ? {
                      lte: filters.cookingTime,
                    }
                  : undefined,
                ...(filters.tags && filters.tags.length > 0
                  ? {
                      tags: {
                        some: {
                          name: {
                            in: filters.tags,
                          },
                        },
                      },
                    }
                  : {}),
                ...(filters.countries && filters.countries.length > 0
                  ? {
                      country: {
                        name: {
                          in: filters.countries,
                        },
                      },
                    }
                  : {}),
                ...(filters.collection
                  ? {
                      collections: {
                        some: {
                          collectionId: filters.collection,
                        },
                      },
                    }
                  : {}),
              },
            },
            include: {
              images: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              name: "desc",
            },
          });

          if (randomRecipes) {
            for (const recipe of randomRecipes) {
              if (recipe.images[0]) {
                recipe.images[0].name = getSignedUrlAws(recipe.images[0].name);
              }
            }
          }
          return { status: "success", recipes: randomRecipes };
        }

        const foundRecipes = await ctx.prisma.recipe.findMany({
          where: {
            name: {
              search: query,
            },
            AND: {
              ...(!publicSearch
                ? {
                    userId: ctx?.session?.user.id,
                  }
                : {}),
              ...(publication
                ? {
                    publicationStatus: publication,
                  }
                : {}),
              cookingTime: filters.cookingTime
                ? {
                    lte: filters.cookingTime,
                  }
                : undefined,
              ...(filters.tags && filters.tags.length > 0
                ? {
                    tags: {
                      some: {
                        name: {
                          in: filters.tags,
                        },
                      },
                    },
                  }
                : {}),
              ...(filters.countries && filters.countries.length > 0
                ? {
                    country: {
                      name: {
                        in: filters.countries,
                      },
                    },
                  }
                : {}),
              ...(filters.collection
                ? {
                    collections: {
                      some: {
                        collectionId: filters.collection,
                      },
                    },
                  }
                : {}),
            },
          },
          include: {
            images: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            _relevance: {
              fields: ["name"],
              search: query,
              sort: "asc",
            },
          },
        });

        if (foundRecipes) {
          for (const recipe of foundRecipes) {
            if (recipe.images[0]) {
              recipe.images[0].name = getSignedUrlAws(recipe.images[0].name);
            }
          }
        }

        return { status: "success", recipes: foundRecipes };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return { status: error.cause, recipes: [], message: error.message };
        }
        return { status: "error", recipes: [] };
      }
    }),
});
