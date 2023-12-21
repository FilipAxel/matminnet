import { type PrismaClient } from "@prisma/client";
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
