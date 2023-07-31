import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getPendingPublications: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.isAdmin) {
      return {
        message: "Authentication is required",
      };
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

      return {
        message: "",
        recipes: recipes,
      };
    } catch (error) {}
  }),

  approvePublication: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      if (!ctx.session.user.isAdmin) {
        return {
          message: "Authentication is required",
        };
      }
      try {
        for (const id of input) {
          await ctx.prisma.recipePublicationRequest.update({
            data: {
              status: "approved",
              recipe: {
                update: {
                  publicationStatus: "published",
                },
              },
            },
            where: {
              id: id,
            },
          });
        }
      } catch (error) {}
    }),

  declinePublication: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.isAdmin) {
        return {
          message: "Authentication is required",
        };
      }
      try {
        for (const id of input) {
          await ctx.prisma.recipePublicationRequest.update({
            data: {
              status: "declined",
              recipe: {
                update: {
                  publicationStatus: "private",
                },
              },
            },
            where: {
              id: id,
            },
          });
        }
      } catch (error) {}
    }),
});
