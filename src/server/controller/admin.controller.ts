import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";
import { type PublicationRequestInput } from "../schema/recipe.schema";

export const processPublicationRequests = async (
  input: PublicationRequestInput,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  if (!ctx.session.user.isAdmin) {
    return {
      message: "Authentication is required",
    };
  }
  try {
    await ctx.prisma.recipePublicationRequest.update({
      data: {
        status: input.action === "approve" ? "approved" : "declined",
        recipe: {
          update: {
            publicationStatus:
              input.action === "approve" ? "published" : "private",
          },
        },
      },
      where: {
        id: input.recipeId,
      },
    });
  } catch (error) {}
};

export const getPendingPublications = async (ctx: {
  prisma: PrismaClient;
  session: Session;
}) => {
  if (!ctx.session.user.isAdmin) {
    return;
  }
  try {
    const recipes = await ctx.prisma.recipePublicationRequest.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        recipe: {
          select: {
            name: true,
          },
        },
      },
    });

    return recipes;
  } catch (error) {}
};
