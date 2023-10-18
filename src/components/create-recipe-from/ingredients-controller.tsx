import React, { type ChangeEvent, Fragment } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { type ActionMeta, type MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { api } from "~/utils/api";

import { Input } from "@nextui-org/react";
import { selectCustomStyle } from "../utils/form-utils";

interface IngredientOption {
  value: string;
  label: string;
  quantity: string;
  unit: string;
}

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
  const customSelectStyles = selectCustomStyle<IngredientOption>();
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
    } else {
      onChange(newValue as IngredientOption[] | ChangeEvent<Element>);
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
    <div className="w-full">
      <CreatableSelect
        isMulti
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        styles={customSelectStyles}
        aria-label={"ingredients"}
        options={ingredientOptions}
        isClearable={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={handleInputChange}
      />
      {currentValue.length > 0 && (
        <div className="m-0 flex w-full flex-wrap rounded-b-lg bg-gray-500  p-2">
          {currentValue.map((option, index) => (
            <Fragment key={option.value}>
              <div className="m-3 flex w-full justify-around gap-5">
                <div className="w-full">
                  <Input
                    aria-labelledby={option.label}
                    aria-label={option.label}
                    size="sm"
                    value={option.label}
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
                    radius="sm"
                    variant="faded"
                    value={option.quantity}
                    type="number"
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="w-full">
                  <Input
                    aria-labelledby={option.unit}
                    size="sm"
                    radius="sm"
                    variant="faded"
                    aria-label={option.unit}
                    value={option.unit}
                    type="text"
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
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
