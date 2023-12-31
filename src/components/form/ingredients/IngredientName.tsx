/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input } from "@nextui-org/react";
import AddIngredients from "./AddIngredients";
import StepDropDown from "./IngredientDropdown";
import { type IngredientInterface } from "./IngredientsStepComponent";
import { type IngredientOption } from "~/components/create-recipe-from/from-interface";

interface StepProps {
  step: IngredientInterface;
  updateStep: (index: number, newStep: string | IngredientInterface) => void;
  updateSubStepValue: (stepIndex: number, newValue: IngredientOption[]) => void;
  deleteTask: (taskIndex: number) => void;
}

const IngredientName: React.FC<StepProps> = ({
  step,
  updateStep,
  updateSubStepValue,
  deleteTask,
}) => {
  const removeTask = () => {
    deleteTask(step.mainStepIndex);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <Input
          variant="faded"
          radius="none"
          required
          className="mt-2"
          id={`step${step.mainStepIndex}`}
          type="text"
          aria-label="step"
          label={`Ingrediens Lista ${step.mainStepIndex}`}
          value={step.sectionName}
          onChange={(e) => updateStep(step.mainStepIndex, e.target.value)}
        />

        <StepDropDown onDelete={removeTask} />
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <AddIngredients
          mainStepIndex={step.mainStepIndex}
          ingredients={step.ingredients}
          updateSubStepValue={updateSubStepValue}
        />
      </div>
    </div>
  );
};

export default IngredientName;
