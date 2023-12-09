import React, { type ChangeEvent, Fragment } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { type ActionMeta, type MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { api } from "~/utils/api";

import { Input } from "@nextui-org/react";
import { selectCustomStyle } from "../utils/form-utils";
import { type IngredientOption } from "./from-interface";

export interface FormIngredients {
  ingredients: IngredientOption[];
}

interface IngredientsControllerProps {
  field: ControllerRenderProps<FormIngredients, "ingredients">;
  currentValue: IngredientOption[];
}

const IngredientsController: React.FC<IngredientsControllerProps> = ({
  field,
  currentValue,
}) => {
  const customSelectStyles = selectCustomStyle();
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
    newValue: MultiValue<IngredientOption[] | IngredientOption>,
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
    } else if (actionMeta.action === "select-option") {
      const updatedValue = [...currentValue, actionMeta.option];
      onChange(updatedValue as IngredientOption[] | ChangeEvent<Element>);
    } else if (actionMeta.action === "remove-value") {
      const labelToRemove = actionMeta.removedValue?.label;
      const updatedValueWithoutRemovedLabel = currentValue.filter(
        (option) => option.value !== labelToRemove
      );
      onChange(updatedValueWithoutRemovedLabel);
    } else {
      onChange([]);
    }
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients = [...currentValue];
    const updatedIngredientsIndex = updatedIngredients[index];
    if (updatedIngredientsIndex) {
      if (field === "unit" && value.length > 15) {
        updatedIngredientsIndex.error =
          "Unit text can be at most 15 characters long.";
      } else {
        updatedIngredientsIndex.error = "";
      }

      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      } as IngredientOption;
      onChange(updatedIngredients);
    }
  };

  return (
    <div className="z-50 w-full">
      <CreatableSelect
        isMulti
        styles={customSelectStyles}
        value={currentValue}
        aria-label={"ingredients"}
        options={ingredientOptions}
        isClearable={true}
        onChange={handleInputChange}
      />
      {currentValue.length > 0 && (
        <div className="m-0 flex w-full flex-wrap rounded-b-lg bg-gray-700 p-2">
          {currentValue.map((option, index) => (
            <Fragment key={option?.label}>
              <div className="m-3 flex w-full justify-around gap-5">
                <div className="w-full">
                  <Input
                    aria-labelledby={option?.label}
                    aria-label={option?.label}
                    size="sm"
                    color="primary"
                    disabled
                    value={option?.label}
                    radius="sm"
                    variant="faded"
                    type="text"
                    onChange={(e) =>
                      handleIngredientChange(index, "label", e.target.value)
                    }
                  />
                </div>

                <div className="w-full">
                  <Input
                    aria-labelledby={"quantity"}
                    aria-label={"quantity"}
                    size="sm"
                    color="primary"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">
                          Quantity
                        </span>
                      </div>
                    }
                    radius="sm"
                    variant="faded"
                    value={option?.quantity}
                    type="number"
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="w-[70%]">
                  <Input
                    aria-labelledby={option?.unit}
                    size="sm"
                    radius="sm"
                    color={option?.error ? "danger" : "primary"}
                    isInvalid={option?.error ? true : false}
                    errorMessage={option?.error}
                    variant="faded"
                    aria-label={option?.unit}
                    value={option?.unit}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">
                          Unit
                        </span>
                      </div>
                    }
                    type="text"
                    onChange={(e) =>
                      handleIngredientChange(
                        index,
                        "unit",
                        e.target.value.toLowerCase()
                      )
                    }
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientsController;
