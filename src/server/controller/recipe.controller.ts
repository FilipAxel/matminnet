import { type PrismaClient } from "@prisma/client";
import {
  type CreateRecipeSchema,
  type IdSchema,
} from "../schema/recipe.schema";
import { findCollections } from "./collection.controller";
import { createdAuthor } from "./author.controller";
import { createIngredients } from "./Ingredient.controller";
import { type Session } from "next-auth";
import { deleteImageFromAws, getSignedUrlAws } from "./aws.controller";
import { TRPCError } from "@trpc/server";
import { createTags } from "./tag.controller";
import { exclude } from "~/utils/prisma-utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { findUniqueCountry } from "./country.controller";

export const createPublicationRequest = async (
  recipeId: string,
  ctx: {
    prisma: PrismaClient;
    session: Session;
  }
) => {
  const { id } = ctx.session.user;

  await ctx.prisma.recipePublicationRequest.create({
    data: {
      recipeId: recipeId,
      userId: id,
    },
  });
};

export const getAllRecipesForUser = async (ctx: {
  prisma: PrismaClient;
  session: Session;
}) => {
  const recipes = await ctx.prisma.recipe.findMany({
    where: {
      userId: ctx.session.user.id,
    },
    include: {
      images: {
        select: {
          name: true,
        },
      },
    },
  });
  if (recipes) {
    for (const recipe of recipes) {
      for (const image of recipe.images) {
        image.name = getSignedUrlAws(image.name);
      }
    }
  }
  return recipes;
};

export const createRecipe = async (
  input: CreateRecipeSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const { id } = ctx.session.user;
  const { recipe, direction, ingredients } = input;
  const {
    author: authorName,
    collections,
    country,
    description,
    tags,
    name,
    servingSize,
    cookingTime,
    video,
    publicationStatus,
  } = recipe;

  const recipeIngredients = ingredients
    ? await createIngredients(ingredients, ctx)
    : null;
  const foundCollections = collections
    ? await findCollections(collections, ctx)
    : null;
  const author = authorName ? await createdAuthor(authorName, ctx) : null;
  const foundUniqueCountry = country
    ? await findUniqueCountry(country, ctx)
    : null;

  const foundTags = await createTags(tags, ctx);
  try {
    const createdRecipe = await ctx.prisma.recipe.create({
      data: {
        name: name,
        description: description,
        countryId: foundUniqueCountry?.id || null,
        servingSize: servingSize,
        cookingTime: cookingTime !== null ? +cookingTime : null,
        directions: {
          create: direction.map((step) => ({
            time:
              step.timer &&
              step.timer.timeValue !== null &&
              step.timer.timeValue !== undefined
                ? {
                    create: {
                      timeValue: +step.timer.timeValue,
                      unit: step.timer.unit ?? null,
                    },
                  }
                : undefined,
            mainStepValue: step.mainStepValue,
            mainStepIndex: step.mainStepIndex,
            subSteps: {
              create: step.subSteps.map((subStep) => ({
                time:
                  subStep.timer &&
                  subStep.timer.timeValue !== null &&
                  subStep.timer.timeValue !== undefined
                    ? {
                        create: {
                          timeValue: +subStep.timer.timeValue,
                          unit: subStep.timer.unit ?? null,
                        },
                      }
                    : undefined,
                subStepValue: subStep.subStepValue,
                subStepIndex: subStep.subStepIndex,
              })),
            },
          })),
        },
        video: video,
        authorId: author?.id,
        userId: id,
        collections: {
          create: foundCollections?.map((collection) => ({
            collection: {
              connect: {
                id: collection.id,
              },
            },
          })),
        },
        tags: {
          create: foundTags?.map((tag) => ({
            tag: {
              connect: {
                id: tag.tagId,
              },
            },
          })),
        },
        ingredientsSection: {
          create: recipeIngredients?.map((ingredient) => ({
            name: ingredient.name,
            ingredients: {
              create: ingredient.ingredients.map((ingredientDetail) => ({
                quantity: ingredientDetail.quantity,
                unit: ingredientDetail.unit,
                ingredient: {
                  connect: {
                    id: ingredientDetail.ingredientId,
                  },
                },
              })),
            },
          })),
        },

        publicationStatus: publicationStatus ? "unapproved" : "private",
      },
    });

    if (publicationStatus) {
      await createPublicationRequest(createdRecipe.id, ctx);
    }

    return {
      status: "success",
      createdRecipe,
    };
  } catch (error) {
    throw error;
  }
};

export const getRecipeAndIngridients = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  return await ctx.prisma.recipe.findUnique({
    where: {
      id: input.id,
    },
    include: {
      ingredientsSection: {
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      },
    },
  });
};

export const getRecipeWithId = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    const recipe = await ctx.prisma.recipe.findUnique({
      where: {
        id: input.id,
      },
      include: {
        author: true,
        images: {
          select: {
            name: true,
          },
        },
        directions: {
          include: {
            subSteps: {
              select: {
                subStepIndex: true,
                subStepValue: true,
                time: {
                  select: {
                    timeValue: true,
                    unit: true,
                  },
                },
              },
            },
            time: {
              select: {
                timeValue: true,
                unit: true,
              },
            },
          },
        },
        ingredientsSection: {
          include: {
            ingredients: {
              include: {
                ingredient: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        collections: {
          include: {
            collection: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (recipe?.images) {
      recipe.images.forEach((image) => {
        image.name = getSignedUrlAws(image.name);
      });
    }

    // TODO recipe schould not be return if the recipe is not publish or the user created the recipe is viewing it.
    // we need to have the userId here in some way.
    if (recipe) {
      return {
        recipe: recipe,
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getApprovedPublication = async (ctx: { prisma: PrismaClient }) => {
  const recipes = await ctx.prisma.recipe.findMany({
    where: {
      publicationStatus: "published",
    },
    include: {
      images: {
        select: {
          name: true,
        },
      },
    },
  });
  for (const recipe of recipes) {
    for (const image of recipe.images) {
      image.name = getSignedUrlAws(image.name);
    }
  }

  return recipes;
};

export const findImageToDelete = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    const recipe = await ctx.prisma.recipe.findUnique({
      where: {
        id: input.id,
      },
      select: {
        images: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!recipe) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipe with that ID not found",
      });
    }
    for (const image of recipe.images) {
      if (image.name) {
        // Delete object from S3 bucket
        await deleteImageFromAws(image.name);
      }
    }
  } catch (error) {
    throw error;
  }
};

export const deleteRecipeWithId = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  await ctx.prisma.recipe.delete({
    where: {
      id: input.id,
    },
  });
  return {
    status: "success",
  };
};

export const getLikes = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    const foundLikes = await ctx.prisma.recipeLike.count({
      where: {
        recipeId: input.id,
      },
    });

    return {
      likes: foundLikes,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Recipe not found.",
        };
      } else {
        return {
          success: false,
          error: "Prisma error: " + error.message,
        };
      }
    } else {
      return {
        success: false,
        error: "Unexpected error",
      };
    }
  }
};

export const getUserRecipeLike = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const { id } = ctx.session.user;
  try {
    const userLikesRecipeQuery = await ctx.prisma.recipeLike.findFirst({
      where: {
        userId: id,
        recipeId: input.id,
      },
    });
    const userLikesRecipe = !!userLikesRecipeQuery;

    return {
      success: true,
      userLikesRecipe,
    };
  } catch (error) {
    throw error;
  }
};

export const addRecipeLike = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  try {
    const { id } = ctx.session.user;
    const foundLike = await ctx.prisma.recipeLike.findFirst({
      where: {
        userId: id,
        recipeId: input.id,
      },
    });

    if (!!foundLike) {
      await ctx.prisma.recipeLike.delete({
        where: {
          recipeId_userId: {
            recipeId: foundLike.recipeId,
            userId: id,
          },
        },
      });

      return {
        success: true,
        message: "Like removed",
      };
    } else {
      await ctx.prisma.recipeLike.create({
        data: {
          recipeId: input.id,
          userId: id,
        },
      });

      return { success: true, message: "Like added" };
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Recipe not found.",
        };
      } else {
        return {
          success: false,
          error: "Prisma error: " + error.message,
        };
      }
    } else {
      return {
        success: false,
        error: "Unexpected error",
      };
    }
  }
};

export const getTopRatedRecipes = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    const topRatedRecipes = await ctx.prisma.recipe.findMany({
      take: +input.id,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      /*  where: {
        publicationStatus: {
          not: "private",
        },
      }, */
      include: {
        likes: true,
        images: {
          take: 1,
          select: {
            name: true,
          },
        },
      },
    });

    interface filteredTopRated {
      id: string;
      name: string;
      images: {
        name: string;
      }[];
    }

    const filteredTopRatedRecipes: filteredTopRated[] = topRatedRecipes.map(
      (recipe) => {
        return exclude(recipe, [
          "authorId",
          "cookingTime",
          "countryId",
          "created_at",
          "updated_at",
          "description",
          "likes",
          "publicationStatus",
          "servingSize",
          "userId",
          "video",
        ]);
      }
    ) as filteredTopRated[];

    if (filteredTopRatedRecipes) {
      filteredTopRatedRecipes.forEach((recipe) => {
        if (recipe.images[0]?.name) {
          recipe.images[0].name = getSignedUrlAws(recipe.images[0].name);
        }
      });
    }

    return {
      success: true,
      topRatedRecipes: filteredTopRatedRecipes,
    };
  } catch (error) {}
};

/* export const updateRecipe = async (
  input: UpdateRecipeSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const {
    id,
    recipe: {
      name,
      description,
      servingSize,
      cookingTime,
      video,
      country,
      tags,
      author: authorName,
      collections,
      publicationStatus,
    },
  } = input;

  const recipeIngredients = await updatedIngredient(input, ctx);
  const foundCollections = await findCollections(collections, ctx);
  const author = await createdAuthor(authorName, ctx);
  const foundTags = await createTags(tags, ctx);

  const updateRecipe = await ctx.prisma.recipe.update({
    data: {
      name: name,
      description: description,
      servingSize: servingSize,
      cookingTime: cookingTime !== null ? +cookingTime : null,
      video: video,
      country: country,
      authorId: author.id,
      collections: {
        create: foundCollections.map((collection) => ({
          collection: {
            connect: {
              id: collection.id,
            },
          },
        })),
      },
      tags: {
        create: foundTags?.map((tag) => ({
          tag: {
            connect: {
              id: tag.tagId,
            },
          },
        })),
      },
         recipeIngredients: {
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

      publicationStatus: publicationStatus ? "unapproved" : "private",
    },
    where: {
      id: id,
    },
  });

  if (publicationStatus) {
    await createPublicationRequest(updateRecipe.id, ctx);
  }

  return {
    status: "success",
    updateRecipe,
  };
}; */
