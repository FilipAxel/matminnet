import React, { Fragment } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { type ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import { api } from "~/utils/api";

import { Grid, Input } from "@nextui-org/react";
import { type FormValues } from "./from-interface";

interface IngredientOption {
  value: string;
  label: string;
  quantity: string;
  unit: string;
}

interface IngredientsControllerProps {
  field: ControllerRenderProps<FormValues, "ingredients">;
  currentValue: IngredientOption[];
}

const IngredientsController: React.FC<IngredientsControllerProps> = ({
  field,
  currentValue,
}) => {
  const { data: ingredients } = api.ingredient.getAllIngredients.useQuery();
  const { onChange } = field;
  const ingredientOptions: IngredientOption[] =
    ingredients?.map((ingredient: { name: string }) => ({
      value: ingredient.name,
      label: ingredient.name,
      quantity: "1",
      unit: "st",
    })) ?? [];

  const handleInputChange = (
    newValue: IngredientOption[],
    actionMeta: ActionMeta<IngredientOption>
  ) => {
    if (actionMeta.action === "create-option") {
      const { label, value } = actionMeta.option;
      const existingOptionIndex = currentValue.findIndex(
        (option) => option.label === label
      );
      if (existingOptionIndex !== -1) {
        currentValue.splice(existingOptionIndex, 1);
      }
      const newIngredient: IngredientOption = {
        value: value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        quantity: "1",
        unit: "st",
      };
      const updatedValue = [...currentValue, newIngredient];
      onChange(updatedValue);
    } else {
      onChange(newValue);
    }
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients = [...currentValue];
    if (updatedIngredients[index]) {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      } as IngredientOption;
      onChange(updatedIngredients);
    }
  };

  return (
    <>
      <CreatableSelect
        {...field}
        isMulti
        options={ingredientOptions}
        isClearable={true}
        onChange={handleInputChange}
      />
      {currentValue.length > 0 && (
        <Grid.Container
          className="m-0 w-full rounded-b-lg bg-gray-500"
          gap={1}
          justify="center"
        >
          {currentValue.map((option, index) => (
            <Fragment key={option.value}>
              <Grid xs={4}>
                <Input
                  aria-labelledby={option.label}
                  size="sm"
                  value={option.label}
                  type="text"
                  onChange={(e) =>
                    handleIngredientChange(index, "label", e.target.value)
                  }
                />
              </Grid>
              <Grid xs={4}>
                <Input
                  aria-labelledby={"quantity"}
                  size="sm"
                  value={option.quantity}
                  type="number"
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                />
              </Grid>
              <Grid xs={4}>
                <Input
                  aria-labelledby={option.unit}
                  size="sm"
                  value={option.unit}
                  type="text"
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                />
              </Grid>
            </Fragment>
          ))}
        </Grid.Container>
      )}
    </>
  );
};

export default IngredientsController;
