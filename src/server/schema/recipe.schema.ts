import { z } from "zod";
/* export const recipeFields = {
  name: z.string(),
  description: z.string(),
  directions: z.string(),
  tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  servingSize: z.string(),
  cookingTime: z.union([z.number(), z.null(), z.string()]),
  video: z.string(),
  country: z.string(),
  author: z.string(),
  collections: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  ingredients: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      quantity: z.string(),
      unit: z.string(),
    })
  ),
  publicationStatus: z.boolean(),
}; */

export const recipeFields = {
  name: z.string(),
  description: z.string(),
  tags: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  servingSize: z.string(),
  cookingTime: z.union([z.number(), z.null(), z.string()]),
  video: z.string(),
  country: z.string(),
  author: z.string(),
  collections: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  ingredients: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      quantity: z.string(),
      unit: z.string(),
    })
  ),
  publicationStatus: z.boolean(),
};

// Define the Direction schema
const DirectionSchema = z.object({
  mainStepValue: z.string(),
  mainStepIndex: z.number(),
  timer: z
    .object({
      timeValue: z.number(),
      unit: z.string(),
    })
    .nullable(),
  subSteps: z.array(
    z.object({
      subStepValue: z.string(),
      subStepIndex: z.number(),
      timer: z
        .object({
          timeValue: z.number(),
          unit: z.string(),
        })
        .nullable(),
    })
  ),
});

export const createRecipeSchema = z.object({
  recipe: z.object(recipeFields),
  direction: z.array(DirectionSchema),
});

export const updateRecipeSchema = z.object({
  id: z.string(),
  recipe: z.object(recipeFields),
});

export const idSchema = z.object({
  id: z.string(),
});

export const recipesIds = z.array(z.string());

export const actionSchema = z.enum(["approve", "decline"]);
export const publicationRequestInputSchema = z.object({
  action: actionSchema,
  recipeId: z.string(),
});

export type PublicationRequestInput = z.TypeOf<
  typeof publicationRequestInputSchema
>;
export type RecipesIds = z.TypeOf<typeof recipesIds>;
export type IdSchema = z.TypeOf<typeof idSchema>;
export type CreateRecipeSchema = z.TypeOf<typeof createRecipeSchema>;
export type UpdateRecipeSchema = z.TypeOf<typeof updateRecipeSchema>;