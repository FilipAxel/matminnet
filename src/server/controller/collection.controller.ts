import { Prisma, type Collection, type PrismaClient } from "@prisma/client";
import {
  type collection,
  type updateCollectionSchema,
  type collections,
} from "../schema/collection.schema";
import { type IdSchema } from "../schema/recipe.schema";
import { getSignedUrlAws } from "./aws.controller";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { type Session } from "next-auth";

export const getCollection = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  try {
    const { id } = ctx.session.user;
    const collection = await ctx.prisma.collection.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!collection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The collection does not exist",
      });
    } else {
      if (id === collection?.userId) {
        return collection;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const getCollections = async (ctx: {
  prisma: PrismaClient;
  session: Session;
}) => {
  const { id } = ctx.session.user;
  const collections = await ctx.prisma.collection.findMany({
    where: {
      User: {
        id: id,
      },
    },
    include: {
      image: {
        select: {
          name: true,
        },
      },
      _count: true,
    },
  });
  if (collections) {
    collections?.forEach((collection) => {
      collection.image?.forEach((image) => {
        image.name = getSignedUrlAws(image.name);
      });
    });

    return collections;
  }
};

export const createCollection = async (
  input: collection,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  try {
    const { id } = ctx.session.user;
    const collection = await ctx.prisma.collection.create({
      data: {
        userId: id,
        name: input.name,
        type: input.type,
      },
    });
    return {
      status: "success",
      response: {
        collection,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "collection with that title already exists",
        });
      }
    }
    throw error;
  }
};

export const updateCollectionImage = async (
  collection: Collection,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const imageName = uuidv4();
  await ctx.prisma.collection.update({
    where: {
      id: collection?.id,
    },
    data: {
      image: {
        create: {
          name: imageName,
        },
      },
    },
  });
  return imageName;
};

export const deleteCollection = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    await ctx.prisma.collection.delete({
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
          message: "collection with that ID not found",
        });
      }
    }
    throw error;
  }
};

export const deleteRecipeOnCollection = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    await ctx.prisma.recipeOnCollection.delete({
      where: {
        id: input.id,
      },
    });
    return {
      status: "success",
    };
  } catch (error) {
    throw error;
  }
};

export const updateCollection = async (
  input: updateCollectionSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    const collection = await ctx.prisma.collection.update({
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
        collection,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collection with that ID not found",
        });
      }
    }
    throw error;
  }
};

export const findCollections = async (
  collections: collections,
  ctx: { prisma: PrismaClient }
) => {
  const foundCollections: Collection[] = [];

  if (collections) {
    for (const collection of collections) {
      const collectionFromDb = await ctx.prisma.collection.findFirst({
        where: {
          id: collection?.value,
        },
      });

      if (collectionFromDb) {
        foundCollections.push(collectionFromDb);
      }
    }
  }
  return foundCollections;
};

export const getRecipesOnCollection = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  const recipes = await ctx.prisma.recipe.findMany({
    where: {
      collections: {
        some: {
          collection: {
            id: input.id,
          },
        },
      },
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
