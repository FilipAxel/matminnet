import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { type TimerInterface } from "./DirectionComponent";

interface SetTimerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (timerValue: number, selectedOption: string) => void;
  timer?: TimerInterface;
}

const SetTimer: React.FC<SetTimerProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  timer,
}) => {
  const { control, handleSubmit, reset } = useForm<{ timer: number }>({
    defaultValues: {
      timer: timer?.timeValue,
    },
  });
  const [selectedOption, setSelectedOption] = useState<string>(
    timer?.unit || "min"
  );

  const handleFormSubmit = (data: { timer: number }) => {
    onSubmit(data.timer, selectedOption);
    onOpenChange();
    reset();
  };
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <>
      <Modal
        className="m-6"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <ModalHeader className="flex flex-col gap-1">Timer</ModalHeader>
              <ModalBody>
                <Controller
                  name="timer"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Timer"
                      placeholder="0.00"
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-small text-default-400">
                            ⏱️
                          </span>
                        </div>
                      }
                      endContent={
                        <div className="flex items-center">
                          <label className="sr-only" htmlFor="currency">
                            Timer
                          </label>
                          <select
                            className="border-0 bg-transparent text-small text-default-400 outline-none"
                            id="currency"
                            name="currency"
                            onChange={handleOptionChange}
                            value={selectedOption}
                          >
                            <option value="sec">sec</option>
                            <option value="min">min</option>
                            <option value="hr">hr</option>
                          </select>
                        </div>
                      }
                      type="number"
                      value={field.value?.toString()}
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Stäng
                </Button>
                <Button className="text-white" color="success" type="submit">
                  Spara
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SetTimer;
