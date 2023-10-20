import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type IngredientOption } from "~/components/create-recipe-from/from-interface";
import IngredientsController, {
  type FormIngredients,
} from "~/components/create-recipe-from/ingredients-controller";

interface SubTaskProps {
  ingredients: IngredientOption[];
  mainStepIndex: number;
  updateSubStepValue: (stepIndex: number, newValue: IngredientOption[]) => void;
}

const AddIngredients: React.FC<SubTaskProps> = ({
  ingredients,
  mainStepIndex,
  updateSubStepValue,
}) => {
  const { control, getValues, watch } = useForm<FormIngredients>({
    defaultValues: {
      ingredients: [...ingredients],
    },
  });

  useEffect(() => {
    const subscription = watch((value) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      updateSubStepValue(mainStepIndex, value.ingredients)
    );
    return () => subscription.unsubscribe();
  }, [watch, updateSubStepValue, mainStepIndex]);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-full">
          <Controller
            name="ingredients"
            render={({ field }) => {
              const currentValue = getValues().ingredients || [];
              return (
                <IngredientsController
                  field={field}
                  currentValue={currentValue}
                />
              );
            }}
            control={control}
          />
        </div>
      </div>
    </>
  );
};

export default AddIngredients;
