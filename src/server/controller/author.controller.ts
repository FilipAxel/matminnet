import { type PrismaClient } from "@prisma/client";

export const createdAuthor = async (
  author: string,
  ctx: { prisma: PrismaClient }
) => {
  const authorFromDb = await ctx.prisma.author.findFirst({
    where: {
      name: author,
    },
  });

  if (authorFromDb) {
    return authorFromDb;
  }

  return await ctx.prisma.author.create({
    data: {
      name: author,
    },
  });
};
