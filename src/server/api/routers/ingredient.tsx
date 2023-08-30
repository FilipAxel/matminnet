import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ingredientRouter = createTRPCRouter({
  getAllIngredients: protectedProcedure.query(async ({ ctx }) => {
    try {
      const ingredients = await ctx.prisma.ingredient.findMany({
        select: {
          name: true,
        },
      });
      return ingredients;
    } catch (error) {
      throw error;
    }
  }),

  deleteIngredient: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.recipeIngredient.delete({
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
    }),
});
