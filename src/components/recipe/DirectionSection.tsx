import {
  Card,
  CardHeader,
  Checkbox,
  Button,
  Divider,
  CardBody,
  cn,
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
    <Card radius="sm" fullWidth key={direction.mainStepIndex} className="p-2">
      <CardHeader className="mb-2 flex flex-col items-start gap-3 ">
        <Checkbox
          color="success"
          size="lg"
          classNames={{
            base: cn(
              "inline-flex w-full max-w-full bg-content1",
              "hover:bg-content2 items-center justify-start",
              "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-success data-[selected=true]:bg-[#E8FAF0]"
            ),
            label: "w-full",
            icon: "text-white",
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
            <MdOutlineTimer /> Öppna Timer:&nbsp;
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
              <div
                className="mb-3 flex w-full min-w-[320px] flex-col p-[6px]"
                key={step.subStepIndex}
              >
                <Checkbox
                  color="success"
                  classNames={{
                    base: cn(
                      "inline-flex w-full max-w-full bg-content1",
                      "hover:bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-success data-[selected=true]:bg-[#E8FAF0]"
                    ),
                    label: "w-full",
                    icon: "text-white",
                  }}
                  size="lg"
                >
                  <p className="ml-2 text-left font-normal">
                    {step.subStepValue}
                  </p>
                  {step.time?.timeValue && (
                    <>
                      <Button
                        className="my-4 bg-[#cf2d051e] text-sm font-semibold text-[#cf2e05]"
                        radius="full"
                        onPress={() => {
                          setOpenTimerStep(step.subStepValue);
                        }}
                      >
                        <MdOutlineTimer /> Öppna Timer:&nbsp;
                        {step.time?.timeValue}&nbsp;
                        {step.time?.unit}
                      </Button>
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
                </Checkbox>
              </div>
            ))}
          </CardBody>
        </>
      )}
    </Card>
  );
};

export default DirectionSection;
