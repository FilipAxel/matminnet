import { type PrismaClient } from "@prisma/client";
import { type ingredients } from "~/server/schema/ingridients.schema";
import {
  type UpdateRecipeSchema,
  type IdSchema,
} from "../schema/recipe.schema";
import { getRecipeAndIngridients } from "./recipe.controller";

export const createIngredients = async (
  ingredients: ingredients,
  ctx: { prisma: PrismaClient }
) => {
  const recipeIngredients: {
    name: string;
    quantity: string;
    unit: string;
    ingredientId: string;
  }[] = [];
  for (const ingredient of ingredients) {
    const existingIngredient = await ctx.prisma.ingredient.findUnique({
      where: {
        name: ingredient.value,
      },
    });

    if (existingIngredient) {
      recipeIngredients.push({
        name: ingredient.value,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        ingredientId: existingIngredient.id,
      });
    } else {
      const newIngredient = await ctx.prisma.ingredient.create({
        data: {
          name: ingredient.value,
        },
      });

      recipeIngredients.push({
        name: ingredient.value,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        ingredientId: newIngredient.id,
      });
    }
  }

  return recipeIngredients;
};

export const getAllIngredients = async (ctx: { prisma: PrismaClient }) => {
  try {
    const ingredients = await ctx.prisma.ingredient.findMany({
      select: {
        name: true,
      },
    });
    return ingredients;
  } catch (error) {
    throw error;
  }
};

export const deleteIngredientOnRecipe = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
  try {
    await ctx.prisma.recipeIngredient.delete({
      where: {
        id: input.id,
      },
    });
    return {
      status: "Success",
    };
  } catch (error) {
    throw error;
  }
};

export const updatedIngredient = async (
  input: UpdateRecipeSchema,
  ctx: { prisma: PrismaClient }
) => {
  const {
    recipe: { ingredients },
  } = input;
  const recipeIngredients: {
    name: string;
    quantity: string;
    unit: string;
    ingredientId?: string;
  }[] = [];

  const originalRecipe = await getRecipeAndIngridients(input, ctx);

  for (const ingredient of ingredients) {
    const existingIngredient = originalRecipe?.recipeIngredients.find(
      (oldIngredient) => oldIngredient.ingredient.name === ingredient.value
    );
    if (existingIngredient) {
      const hasQuantityUpdated =
        existingIngredient.quantity !== ingredient.quantity;
      const hasUnitUpdated = existingIngredient.unit !== ingredient.unit;

      if (hasQuantityUpdated || hasUnitUpdated) {
        const updatedIngredient = {
          ...existingIngredient,
          quantity: hasQuantityUpdated
            ? ingredient.quantity
            : existingIngredient.quantity,
          unit: hasUnitUpdated ? ingredient.unit : existingIngredient.unit,
        };
        await ctx.prisma.recipeIngredient.update({
          where: {
            id: updatedIngredient.id,
          },
          data: {
            quantity: updatedIngredient.quantity,
            unit: updatedIngredient.unit,
          },
        });
      }
    } else {
      const existingIngredient = await ctx.prisma.ingredient.findUnique({
        where: {
          name: ingredient.value,
        },
      });

      if (existingIngredient) {
        recipeIngredients.push({
          name: ingredient.value,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          ingredientId: existingIngredient.id,
        });
      } else {
        const newIngredient = await ctx.prisma.ingredient.create({
          data: {
            name: ingredient.value,
          },
        });

        recipeIngredients.push({
          name: ingredient.value,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          ingredientId: newIngredient.id,
        });
      }
    }
  }
  return recipeIngredients;
};
