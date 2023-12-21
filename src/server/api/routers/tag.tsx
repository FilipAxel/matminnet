import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAllTags, getTags } from "~/server/controller/tag.controller";
import { pagination } from "~/server/schema/utils";

export const tagRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(async ({ ctx }) => await getAllTags(ctx)),

  getTags: publicProcedure
    .input(pagination)
    .query(async ({ ctx, input }) => await getTags(input, ctx)),
});
