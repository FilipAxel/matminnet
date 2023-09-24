import { type PrismaClient } from "@prisma/client";
import {
  type UpdateRecipeSchema,
  type CreateRecipeSchema,
  type IdSchema,
} from "../schema/recipe.schema";
import { findCollections } from "./collection.controller";
import { createdAuthor } from "./author.controller";
import { createIngredients, updatedIngredient } from "./Ingredient.controller";
import { type Session } from "next-auth";
import { deleteImageFromAws, getSignedUrlAws } from "./aws.controller";
import { TRPCError } from "@trpc/server";
import { createTags } from "./tag.controller";

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
  const { recipe, direction } = input;
  console.log(direction);
  const {
    author: authorName,
    collections,
    country,
    description,
    tags,
    ingredients,
    name,
    servingSize,
    cookingTime,
    video,
    publicationStatus,
  } = recipe;

  const foundCollections = await findCollections(collections, ctx);
  const author = await createdAuthor(authorName, ctx);
  const recipeIngredients = await createIngredients(ingredients, ctx);
  const foundTags = await createTags(tags, ctx);

  try {
    const createdRecipe = await ctx.prisma.recipe.create({
      data: {
        name: name,
        description: description,
        country: country,
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
                      timeValue: step.timer.timeValue,
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
      include: {
        recipeIngredients: true,
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
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
};

export const getRecipeWithId = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const { user } = ctx.session;
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
        directions: true,
        recipeIngredients: {
          include: {
            ingredient: true,
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
    if (
      recipe?.publicationStatus === "published" ||
      user.id === recipe?.userId
    ) {
      if (recipe?.images) {
        recipe.images.forEach((image) => {
          image.name = getSignedUrlAws(image.name);
        });
      }

      return recipe;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it up the call stack
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

export const updateRecipe = async (
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
};
