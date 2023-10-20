import { Input, useDisclosure } from "@nextui-org/react";

import StepDropDown from "./step-dropdown";
import SetTimer from "./setTimer";
import { type subStepInterface } from "./DirectionComponent";

interface SubTaskProps {
  subStep: subStepInterface;
  mainStepIndex: number;
  removeSubTask: (subStepIndex: number) => void;
  updateSubStepValue: (
    stepIndex: number,
    newValue: string,
    subStepIndex: number
  ) => void;
  updateSubStepTime: (
    stepIndex: number,
    time: { timeValue: number; unit: string },
    subStepIndex: number
  ) => void;
}

const SubTask: React.FC<SubTaskProps> = ({
  subStep,
  mainStepIndex,
  removeSubTask,
  updateSubStepValue,
  updateSubStepTime,
}) => {
  const onDelete = () => removeSubTask(subStep.subStepIndex);
  const onTimerSubmit = (timerValue: number, selectedOption: string) => {
    const newTimer = { timeValue: timerValue, unit: selectedOption };
    updateSubStepTime(mainStepIndex, newTimer, subStep.subStepIndex);
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
            timer={subStep.timer}
          />
        )}
      </div>
    </>
  );
};

export default SubTask;
