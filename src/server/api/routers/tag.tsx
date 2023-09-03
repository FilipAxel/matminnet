import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  deleteTagOnRecipe,
  getAllTags,
} from "~/server/controller/tag.controller";
import { idSchema } from "~/server/schema/recipe.schema";

export const tagRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(async ({ ctx }) => await getAllTags(ctx)),

  deleteTagOnRecipe: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => deleteTagOnRecipe(input, ctx)),
});
