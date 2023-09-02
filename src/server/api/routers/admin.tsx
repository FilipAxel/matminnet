import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getPendingPublications,
  processPublicationRequests,
} from "~/server/controller/admin.controller";
import { publicationRequestInputSchema } from "~/server/schema/recipe.schema";

export const adminRouter = createTRPCRouter({
  getPendingPublications: protectedProcedure.query(
    async ({ ctx }) => await getPendingPublications(ctx)
  ),

  processPublicationRequests: protectedProcedure
    .input(publicationRequestInputSchema)
    .mutation(
      async ({ input, ctx }) => await processPublicationRequests(input, ctx)
    ),
});
