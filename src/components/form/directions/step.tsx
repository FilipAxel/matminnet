/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input, Tooltip, useDisclosure } from "@nextui-org/react";
import AddStep from "./add-step";
import SubTask from "./sub-task";
import StepDropDown from "./step-dropdown";
import { type TimerInterface, type StepInterface } from "./DirectionComponent";
import SetTimer from "./setTimer";
import { useState } from "react";

interface StepProps {
  step: StepInterface;
  updateStep: (index: number, newStep: string | StepInterface) => void;
  updateSubStepValue: (
    stepIndex: number,
    newSubStep: string,
    subStepIndex: number
  ) => void;

  updateSubStepTime: (
    stepIndex: number,
    time: TimerInterface,
    subStepIndex: number
  ) => void;
  deleteTask: (taskIndex: number) => void;
}

const Step: React.FC<StepProps> = ({
  step,
  updateStep,
  updateSubStepValue,
  deleteTask,
  updateSubStepTime,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenToolTip, setIsOpenToolTip] = useState(false);

  const addSubStep = () => {
    if (!step.mainStepValue.trim()) {
      setIsOpenToolTip(true);
      setTimeout(() => {
        setIsOpenToolTip(false);
      }, 2000);
      return;
    }

    const newSubStep = {
      subStepIndex: step.subSteps.length + 1,
      subStepValue: "",
    };
    const updatedStep = {
      ...step,
      subSteps: [...step.subSteps, newSubStep],
    };
    updateStep(step.mainStepIndex, updatedStep);
  };

  const removeSubTask = (subStepIndex: number) => {
    const updatedSubTasks = step.subSteps.filter(
      (subStep) => subStep.subStepIndex !== subStepIndex
    );
    const updatedStep = {
      ...step,
      subSteps: updatedSubTasks.map((subStep, index) => ({
        ...subStep,
        subStepIndex: index + 1,
      })),
    };
    updateStep(step.mainStepIndex, updatedStep);
  };

  const removeTask = () => {
    deleteTask(step.mainStepIndex); // Call the deleteTask function with the task index
  };
  const onTimerSubmit = (timerValue: number, selectedOption: string) => {
    const newTimer = { timeValue: timerValue, unit: selectedOption };

    // Create an updated step object with the new timer object
    const updatedStep = {
      ...step,
      timer: newTimer,
    };
    const updatedStepTyped: StepInterface = updatedStep;
    updateStep(step.mainStepIndex, updatedStepTyped);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <Tooltip
          showArrow
          placement="top-start"
          isOpen={isOpenToolTip}
          content={`Step ${step.mainStepIndex} Value is Required to Add Sub-Steps`}
          classNames={{
            base: "py-2 mb-2 px-4 shadow-xl text-white bg-[#F5A524]",
            arrow: "bg-[#F5A524] mb-2 dark:bg-white",
          }}
        >
          <Input
            variant="faded"
            radius="none"
            required
            className="mt-2"
            id={`step${step.mainStepIndex}`}
            type="text"
            aria-label="step"
            label={`Step ${step.mainStepIndex}`}
            value={step.mainStepValue}
            onChange={(e) => updateStep(step.mainStepIndex, e.target.value)}
          />
        </Tooltip>
        <StepDropDown onOpen={onOpen} onDelete={removeTask} />
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {step.subSteps.map((subStep, subStepIndex) => (
          <SubTask
            key={subStepIndex}
            mainStepIndex={step.mainStepIndex}
            subStep={subStep}
            removeSubTask={removeSubTask}
            updateSubStepValue={updateSubStepValue}
            updateSubStepTime={updateSubStepTime}
          />
        ))}
        <div className="w-[85%]">
          <AddStep
            stepCount={step.subSteps.length}
            onAddStepClick={addSubStep}
            text={"Add Sub-task"}
          />
        </div>
      </div>
      {isOpen && (
        <SetTimer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSubmit={onTimerSubmit}
          timer={step.timer}
        />
      )}
    </div>
  );
};

export default Step;
