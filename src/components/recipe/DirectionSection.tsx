import {
  Card,
  CardHeader,
  Checkbox,
  Button,
  Divider,
  CardBody,
} from "@nextui-org/react";
import { useState } from "react";
import { MdOutlineTimer } from "react-icons/md";
import TimerDialog from "~/components/dialog/timer-dialog";

interface DirectionSectionProps {
  direction: {
    time: {
      timeValue: number;
      unit: string;
    } | null;
    subSteps: {
      time: {
        timeValue: number;
        unit: string;
      } | null;
      subStepValue: string;
      subStepIndex: number;
    }[];
  } & {
    id: string;
    recipeId: string;
    mainStepValue: string;
    mainStepIndex: number;
    timeId: string | null;
  };
}

const DirectionSection: React.FC<DirectionSectionProps> = ({ direction }) => {
  const [openTimerStep, setOpenTimerStep] = useState<string>("");
  return (
    <Card
      radius="sm"
      fullWidth
      key={direction.mainStepIndex}
      className="max-w-[700px] p-2"
    >
      <CardHeader className="flex flex-col items-start gap-3">
        <Checkbox
          lineThrough
          color="primary"
          radius="none"
          size="lg"
          classNames={{
            base: "data-[selected=true]:truncate",
            label: "data-[selected=true]:truncate",
          }}
        >
          <p className="ml-1 text-left font-normal">
            {direction.mainStepValue}
          </p>
        </Checkbox>
      </CardHeader>

      {direction.time?.timeValue && (
        <>
          <Button
            className="mx-2 my-4 bg-[#cf2d051e] text-base font-semibold text-[#cf2e05]"
            radius="full"
            onPress={() => setOpenTimerStep(direction.mainStepValue)}
          >
            <MdOutlineTimer /> Open Timer:&nbsp;
            {direction.time?.timeValue}&nbsp;
            {direction.time?.unit}
          </Button>
          {openTimerStep === direction.mainStepValue && (
            <TimerDialog
              direction={direction.mainStepValue}
              timeValue={direction.time?.timeValue}
              unit={direction.time?.unit}
              isOpen={openTimerStep === direction.mainStepValue}
              onClose={() => setOpenTimerStep("")}
            />
          )}
        </>
      )}

      {direction.subSteps.length > 0 && (
        <>
          <Divider />
          <CardBody>
            {direction.subSteps.map((step) => (
              <div className="p-[6px]" key={step.subStepIndex}>
                <Checkbox
                  lineThrough
                  color="primary"
                  classNames={{
                    base: "data-[selected=true]:truncate",
                    label: "data-[selected=true]:truncate",
                  }}
                  radius="none"
                  size="lg"
                >
                  <p className="ml-2 text-left font-normal">
                    {step.subStepValue}
                  </p>
                </Checkbox>
                {step.time?.timeValue && (
                  <>
                    <Button
                      className="my-4 bg-[#cf2d051e] text-sm font-semibold text-[#cf2e05]"
                      radius="full"
                      onPress={() => {
                        setOpenTimerStep(step.subStepValue);
                      }}
                    >
                      <MdOutlineTimer /> Open Timer:&nbsp;
                      {step.time?.timeValue}&nbsp;
                      {step.time?.unit}
                    </Button>
                    <Divider className="mb-2" />
                    {openTimerStep === step.subStepValue && (
                      <TimerDialog
                        direction={step.subStepValue}
                        timeValue={step.time?.timeValue}
                        unit={step.time?.unit}
                        isOpen={openTimerStep === step.subStepValue}
                        onClose={() => setOpenTimerStep("")}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </CardBody>
        </>
      )}
    </Card>
  );
};

export default DirectionSection;
