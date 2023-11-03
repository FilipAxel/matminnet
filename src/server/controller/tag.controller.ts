import { type PrismaClient } from "@prisma/client";
import { type Tags } from "../schema/tag.schema";
import { type IdSchema } from "../schema/recipe.schema";
import { type Pagination } from "../schema/utils";
import { exclude } from "~/utils/prisma-utils";

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
      const existingTag = await getTag(tag.value, ctx);

      if (existingTag) {
        recipeTag.push({
          name: tag.value,
          tagId: existingTag.id,
        });
      } else {
        const newTag = await ctx.prisma.tag.create({
          data: {
            name: tag.value,
          },
        });

        recipeTag.push({
          name: tag.value,
          tagId: newTag.id,
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
