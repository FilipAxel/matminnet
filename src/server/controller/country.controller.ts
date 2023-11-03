import { type PrismaClient } from "@prisma/client";
import { type Pagination } from "../schema/utils";

export const getAllCountries = async (
  input: Pagination,
  ctx: { prisma: PrismaClient }
) => {
  const { page, pageSize } = input;
  const skip = (page - 1) * pageSize;
  try {
    const countrys = await ctx.prisma.country.findMany({
      skip,
      take: pageSize,
      include: {
        image: {
          select: {
            name: true,
          },
        },
      },
    });

    return countrys;
  } catch (error) {
    console.error(error);
  }
};

export const findUniqueCountry = async (
  country: string,
  ctx: { prisma: PrismaClient }
) => {
  return await ctx.prisma.country.findUnique({
    where: {
      name: country,
    },
  });
};
