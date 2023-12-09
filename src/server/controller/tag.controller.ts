import { Prisma, type PrismaClient } from "@prisma/client";
import { type Tags } from "../schema/tag.schema";
import { type IdSchema } from "../schema/recipe.schema";
import { type Pagination } from "../schema/utils";
import { exclude } from "~/utils/prisma-utils";
import { getSignedUrlAws } from "./aws.controller";

export const getAllTags = async (ctx: { prisma: PrismaClient }) => {
  try {
    const tags = await ctx.prisma.tag.findMany({
      orderBy: {
        created_at: "asc",
      },
    });

    return tags;
  } catch (error) {
    throw error;
  }
};

export const getTag = async (value: string, ctx: { prisma: PrismaClient }) => {
  try {
    return await ctx.prisma.tag.findUnique({
      where: {
        name: value,
      },
    });
  } catch (error) {}
};

export const createTags = async (tags: Tags, ctx: { prisma: PrismaClient }) => {
  try {
    const recipeTag: {
      name: string;
      tagId?: string;
    }[] = [];

    for (const tag of tags) {
      const existingTag = await getTag(tag, ctx);
      if (existingTag) {
        recipeTag.push({
          name: tag,
          tagId: existingTag.id,
        });
      }
    }

    return recipeTag;
  } catch (error) {
    // Handle errors here
  }
};

export const deleteTagOnRecipe = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    await ctx.prisma.recipeTags.delete({
      where: {
        id: input.id,
      },
    });
    return {
      status: "Success",
    };
  } catch (error) {
    throw error;
  }
};
export const getTags = async (
  input: Pagination,
  ctx: { prisma: PrismaClient }
) => {
  const { page, pageSize } = input;
  const skip = (page - 1) * pageSize;
  try {
    const tags = await ctx.prisma.tag.findMany({
      skip,
      take: pageSize,
    });

    const filteredTags = tags.map((tag) => {
      return exclude(tag, ["created_at", "updated_at"]);
    });

    return {
      filteredTags,
    };
  } catch (error) {
    console.error(error);
  }
};
export const getRecipeWithTag = async (
  tagName: string,
  ctx: { prisma: PrismaClient },
  userid?: string
) => {
  try {
    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        tags: {
          some: {
            tag: {
              name: tagName,
            },
          },
        },

        AND: [
          {
            OR: [
              {
                publicationStatus: "published",
              },
              {
                AND: [
                  {
                    userId: userid,
                  },
                  {
                    publicationStatus: undefined,
                  },
                ],
              },
            ],
          },
        ],
      },

      include: {
        images: {
          select: {
            name: true,
          },
        },
      },
    });

    if (recipes.length === 0) {
      throw new Error("No recipes found for the specified tag.");
    }

    for (const recipe of recipes) {
      if (recipe.images[0]) {
        recipe.images[0].name = getSignedUrlAws(recipe.images[0].name);
      }
    }

    const filterRecipes = recipes.map((recipe) => {
      return exclude(recipe, [
        "userId",
        "updated_at",
        "created_at",
        "description",
        "video",
        "authorId",
        "countryId",
      ]);
    });

    return {
      recipes: filterRecipes,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.error("Prisma constraint violation:", error.message);
      throw new Error("Invalid input. Please check your request parameters.");
    } else {
      console.error("Error fetching recipes with tag:", error);
      throw error;
    }
  }
};
