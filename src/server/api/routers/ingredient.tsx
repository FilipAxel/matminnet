import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  deleteIngredientOnRecipe,
  getAllIngredients,
} from "~/server/controller/Ingredient.controller";

export const ingredientRouter = createTRPCRouter({
  getAllIngredients: protectedProcedure.query(
    async ({ ctx }) => await getAllIngredients(ctx)
  ),

  deleteIngredientOnRecipe: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      async ({ input, ctx }) => await deleteIngredientOnRecipe(input, ctx)
    ),
});
