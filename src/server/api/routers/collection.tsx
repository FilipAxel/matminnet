import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPresignedUrlForCollection } from "~/server/controller/aws.controller";
import {
  createCollection,
  deleteCollection,
  deleteRecipeOnCollection,
  getCollection,
  getCollections,
  updateCollection,
} from "~/server/controller/collection.controller";
import {
  collection,
  updateCollectionSchema,
} from "~/server/schema/collection.schema";
import { idSchema } from "~/server/schema/recipe.schema";

export const collectionRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(idSchema)
    .mutation(
      async ({ input, ctx }) =>
        await createPresignedUrlForCollection(input, ctx)
    ),

  getCollections: protectedProcedure.query(
    async ({ ctx }) => await getCollections(ctx)
  ),

  getCollectionWithId: protectedProcedure
    .input(idSchema)
    .query(async ({ input, ctx }) => await getCollection(input, ctx)),

  createCollection: protectedProcedure
    .input(collection)
    .mutation(async ({ input, ctx }) => await createCollection(input, ctx)),

  deleteCollectionWithId: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => await deleteCollection(input, ctx)),

  updateCollection: protectedProcedure
    .input(updateCollectionSchema)
    .mutation(async ({ input, ctx }) => await updateCollection(input, ctx)),

  deleteRecipeOnCollection: protectedProcedure
    .input(idSchema)
    .mutation(
      async ({ input, ctx }) => await deleteRecipeOnCollection(input, ctx)
    ),
});
