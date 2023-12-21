import { createTRPCRouter } from "~/server/api/trpc";
import { collectionRouter } from "./routers/collection";
import { recipeRouter } from "./routers/recipe";
import { adminRouter } from "./routers/admin";
import { ingredientRouter } from "./routers/ingredient";
import { tagRouter } from "./routers/tag";
import { CountryRouter } from "./routers/country";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  recipe: recipeRouter,
  admin: adminRouter,
  ingredient: ingredientRouter,
  tag: tagRouter,
  country: CountryRouter,
  searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
