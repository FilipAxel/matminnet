import { useState, type Dispatch, type SetStateAction } from "react";
import AddIngredientStep from "./AddIngredientStep";
import IngredientName from "./IngredientName";
import { ScrollShadow, cn } from "@nextui-org/react";
import { type IngredientOption } from "~/components/create-recipe-from/from-interface";

export interface IngredientInterface {
  mainStepIndex: number;
  sectionName: string;
  ingredients: IngredientOption[];
}

interface IngredientsStepProps {
  ingredientSection: IngredientInterface[];
  setIngredientSection: Dispatch<SetStateAction<IngredientInterface[]>>;
}

const IngredientsStepComponent: React.FC<IngredientsStepProps> = ({
  ingredientSection,
  setIngredientSection,
}) => {
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  const addStep = () => {
    const newStepIndex = ingredientSection.length + 1;
    const newStep = {
      mainStepIndex: newStepIndex,
      sectionName: "",
      ingredients: [],
    };
    setIngredientSection([...ingredientSection, newStep]);
  };

  const updateSubStepValue = (
    stepIndex: number,
    newValue: IngredientOption[]
  ) => {
    const updatedStep = ingredientSection.map((step, i) => {
      if (step.mainStepIndex === stepIndex) {
        step.ingredients = newValue;
        return step;
      } else {
        return step;
      }
    });
    setIngredientSection(updatedStep);
  };

  const updateStep = (index: number, name: string | IngredientInterface) => {
    const updatedSteps = [...ingredientSection];
    if (index >= 1 && index <= updatedSteps.length) {
      const targetStep = updatedSteps[index - 1];
      if (typeof name === "string") {
        if (targetStep) {
          targetStep.sectionName = name;
        }
      } else {
        updatedSteps[index - 1] = name;
      }
      setIngredientSection(updatedSteps);
    }
  };

  const deleteTask = (taskIndex: number) => {
    const updatedSteps = [...ingredientSection];

    const indexToDelete = updatedSteps.findIndex(
      (step) => step.mainStepIndex === taskIndex
    );

    if (indexToDelete !== -1) {
      updatedSteps.splice(indexToDelete, 1);

      updatedSteps.forEach((step, index) => {
        step.mainStepIndex = index + 1;
      });
      setIngredientSection(updatedSteps);
    }
  };

  return (
    <div className="my-10">
      <h1 className="mb-5 text-4xl font-semibold">Ingredients</h1>
      <ScrollShadow
        onClick={toggleSize}
        size={shadowSize}
        hideScrollBar={true}
        className={cn("mb-8", {
          "h-[65px]": shadowSize === 50,
          "h-[120px]": shadowSize === 0,
        })}
      >
        <p className="max-w-[70ch] text-sm text-gray-500">
          Ensure your recipe is complete by adding all the necessary
          ingredients. Each ingredient can be customized with quantity and units
          to make your recipe as precise as possible. Begin by selecting or
          creating ingredients below, and don&apos;t forget to specify
          quantities and units as needed.
        </p>
      </ScrollShadow>

      {ingredientSection?.map((step) => (
        <IngredientName
          key={step.mainStepIndex}
          updateStep={updateStep}
          updateSubStepValue={updateSubStepValue}
          deleteTask={deleteTask}
          step={step}
        />
      ))}
      <div className="mt-11">
        <AddIngredientStep
          stepCount={ingredientSection.length}
          onAddStepClick={addStep}
          text={"Add Step"}
        />
      </div>
    </div>
  );
};

export default IngredientsStepComponent;
