import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getRecipesOnCollection } from "~/server/controller/collection.controller";
import {
  addRecipeLike,
  getLikes,
  createRecipe,
  deleteRecipeWithId,
  findImageToDelete,
  getAllRecipesForUser,
  getApprovedPublication,
  getRecipeWithId,
  getUserRecipeLike,
  getTopRatedRecipes,
} from "~/server/controller/recipe.controller";
import { createRecipeSchema, idSchema } from "~/server/schema/recipe.schema";
import { createPresignedUrlForRecipe } from "~/server/controller/aws.controller";

export const recipeRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(idSchema)
    .mutation(
      async ({ ctx, input }) => await createPresignedUrlForRecipe(input, ctx)
    ),

  getAllRecipesForUser: protectedProcedure.query(async ({ ctx }) =>
    getAllRecipesForUser(ctx)
  ),

  getApprovedPublication: publicProcedure.query(
    async ({ ctx }) => await getApprovedPublication(ctx)
  ),

  getRecipesOnCollection: protectedProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => await getRecipesOnCollection(input, ctx)),

  getRecipeWithId: publicProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => getRecipeWithId(input, ctx)),

  createRecipe: protectedProcedure
    .input(createRecipeSchema)
    .mutation(async ({ input, ctx }) => await createRecipe(input, ctx)),

  /*  updateRecipe: protectedProcedure
    .input(updateRecipeSchema)
    .mutation(async ({ input, ctx }) => updateRecipe(input, ctx)),
 */
  deleteImagesFromAws: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => findImageToDelete(input, ctx)),

  deleteRecipeWithId: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => deleteRecipeWithId(input, ctx)),

  getLikes: publicProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => await getLikes(input, ctx)),

  addRecipeLike: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => addRecipeLike(input, ctx)),

  getUserRecipeLike: protectedProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => getUserRecipeLike(input, ctx)),

  getTopRatedRecipes: publicProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => getTopRatedRecipes(input, ctx)),
});
