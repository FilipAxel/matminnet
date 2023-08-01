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
      console.log(error);
    }
  }),
});
