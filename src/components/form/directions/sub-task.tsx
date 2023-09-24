import { Input, useDisclosure } from "@nextui-org/react";

import StepDropDown from "./step-dropdown";
import SetTimer from "./setTimer";

interface SubTaskProps {
  subStep: { subStepIndex: number; subStepValue: string };
  mainStepIndex: number;
  removeSubTask: (subStepIndex: number) => void;
  updateSubStepValue: (
    stepIndex: number,
    newValue: string,
    subStepIndex: number
  ) => void;
}

const SubTask: React.FC<SubTaskProps> = ({
  subStep,
  mainStepIndex,
  removeSubTask,
  updateSubStepValue,
}) => {
  const onDelete = () => removeSubTask(subStep.subStepIndex);

  const onTimerSubmit = (timerValue: number, selectedOption: string) => {
    // Handle timer submission here in the parent component
    console.log("Timer Value:", timerValue);
    console.log("Selected Option:", selectedOption);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-[75%]">
          <Input
            variant="faded"
            radius="none"
            value={subStep.subStepValue}
            onChange={(e) => {
              const updatedValue = e.target.value;
              updateSubStepValue(
                mainStepIndex,
                updatedValue,
                subStep.subStepIndex
              );
            }}
            id={`subStep${subStep.subStepIndex}`}
            label={`Sub Step 1.${subStep.subStepIndex}`}
            type="text"
            aria-label="step"
          />
        </div>

        <StepDropDown onDelete={onDelete} onOpen={onOpen} />
        {isOpen && (
          <SetTimer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={onTimerSubmit}
          />
        )}
      </div>
    </>
  );
};

export default SubTask;
