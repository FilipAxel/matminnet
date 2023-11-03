import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAllCountries } from "~/server/controller/country.controller";
import { pagination } from "~/server/schema/utils";

export const CountryRouter = createTRPCRouter({
  getCountrys: publicProcedure
    .input(pagination)
    .query(async ({ ctx, input }) => await getAllCountries(input, ctx)),
});
