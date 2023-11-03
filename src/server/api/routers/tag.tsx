import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  deleteTagOnRecipe,
  getAllTags,
  getTags,
} from "~/server/controller/tag.controller";
import { idSchema } from "~/server/schema/recipe.schema";
import { pagination } from "~/server/schema/utils";

export const tagRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(async ({ ctx }) => await getAllTags(ctx)),

  deleteTagOnRecipe: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => deleteTagOnRecipe(input, ctx)),

  getTags: publicProcedure
    .input(pagination)
    .query(async ({ ctx, input }) => await getTags(input, ctx)),
});
