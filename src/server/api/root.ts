import { createTRPCRouter } from "~/server/api/trpc";
import { catalogRouter } from "./routers/catalog";
import { recipeRouter } from "./routers/recipe";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  catalog: catalogRouter,
  recipe: recipeRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
