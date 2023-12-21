import { useState, type Dispatch, type SetStateAction } from "react";
import AddStep from "./add-step";
import Step from "./step";
import { ScrollShadow, cn } from "@nextui-org/react";

export interface StepInterface {
  mainStepIndex: number;
  mainStepValue: string;
  timer?: TimerInterface;
  subSteps: subStepInterface[];
}

export interface subStepInterface {
  subStepIndex: number;
  subStepValue: string;
  timer?: TimerInterface;
}

export interface TimerInterface {
  timeValue: number;
  unit: string;
}

interface DirectionsProps {
  directionsSteps: StepInterface[];
  setDirectionsSteps: Dispatch<SetStateAction<StepInterface[]>>;
}

const DirectionComponent: React.FC<DirectionsProps> = ({
  directionsSteps,
  setDirectionsSteps,
}) => {
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  const addStep = () => {
    const newStepIndex = directionsSteps.length + 1;
    const newStep = {
      mainStepIndex: newStepIndex,
      mainStepValue: "",
      subSteps: [],
    };
    setDirectionsSteps([...directionsSteps, newStep]);
  };

  const updateSubStepValue = (
    stepIndex: number,
    newValue: string,
    subStepIndex: number
  ) => {
    const updatedSteps = [...directionsSteps];
    const step = updatedSteps.find((step) => step.mainStepIndex === stepIndex);

    if (step) {
      if (subStepIndex !== undefined) {
        const subStep = step.subSteps.find(
          (subStep) => subStep.subStepIndex === subStepIndex
        );

        if (subStep) {
          subStep.subStepValue = newValue;
        }
      } else {
        step.mainStepValue = newValue;
      }

      setDirectionsSteps(updatedSteps);
    }
  };

  const updateSubStepTime = (
    stepIndex: number,
    time: TimerInterface,
    subStepIndex: number
  ) => {
    const updatedSteps = [...directionsSteps];
    const step = updatedSteps.find((step) => step.mainStepIndex === stepIndex);
    if (step) {
      if (subStepIndex !== undefined) {
        const subStep = step.subSteps.find(
          (subStep) => subStep.subStepIndex === subStepIndex
        );
        if (subStep) {
          subStep.timer = time;
        }
      }
    }
  };

  const updateStep = (index: number, newValue: string | StepInterface) => {
    const updatedSteps = [...directionsSteps];
    if (index >= 1 && index <= updatedSteps.length) {
      const targetStep = updatedSteps[index - 1];
      if (typeof newValue === "string") {
        if (targetStep) {
          targetStep.mainStepValue = newValue;
          targetStep.mainStepValue.trim();
        }
      } else {
        updatedSteps[index - 1] = newValue;
      }
      setDirectionsSteps(updatedSteps);
    }
  };

  const deleteTask = (taskIndex: number) => {
    const updatedSteps = [...directionsSteps];

    const indexToDelete = updatedSteps.findIndex(
      (step) => step.mainStepIndex === taskIndex
    );

    if (indexToDelete !== -1) {
      updatedSteps.splice(indexToDelete, 1);

      updatedSteps.forEach((step, index) => {
        step.mainStepIndex = index + 1;
      });
      setDirectionsSteps(updatedSteps);
    }
  };

  return (
    <div className="my-10">
      <h1 className="mb-5 text-4xl font-semibold">Instruktioner</h1>
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
          Lägg till detaljerade steg för att guida dig genom receptets
          förberedelse. Varje steg kan ha delsteg och timer för att hjälpa dig
          att följa med smidigt. Klicka på &apos;Lägg till steg&apos; nedan för
          att komma igång och använd &apos;Lägg till delsteg&apos;-knappen inom
          varje steg för att bryta ned processen ytterligare. Glöm inte att
          ställa in timer för exakta tillagningstider eller förberedelsetider
        </p>
      </ScrollShadow>

      {directionsSteps.map((step) => (
        <Step
          key={step.mainStepIndex}
          updateStep={updateStep}
          updateSubStepValue={updateSubStepValue}
          updateSubStepTime={updateSubStepTime}
          deleteTask={deleteTask}
          step={step}
        />
      ))}
      <div className="mt-11">
        <AddStep
          stepCount={directionsSteps.length}
          onAddStepClick={addStep}
          text={"Lägg till steg"}
        />
      </div>
    </div>
  );
};

export default DirectionComponent;
