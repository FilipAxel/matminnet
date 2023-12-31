/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
  useDisclosure,
  usePagination,
} from "@nextui-org/react";
import { useState } from "react";
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineTimer,
} from "react-icons/md";
import TimerDialog from "./timer-dialog";
import { FaPlay } from "react-icons/fa6";
import IngrediantDialog, {
  type IngredientsSection,
} from "./ingredients-dialog";

interface Time {
  timeValue: number;
  unit: string;
}

interface SubStep {
  subStepIndex: number;
  subStepValue: string;
  time: Time | null;
}

interface Direction {
  id: string;
  recipeId: string;
  mainStepValue: string;
  mainStepIndex: number;
  timeId: string | null;
  time: Time | null;
  subSteps: SubStep[];
}

interface CookModeProps {
  directions: Direction[];
  ingredientsSection: IngredientsSection[];
}

const CookModeDialog: React.FC<CookModeProps> = ({
  directions,
  ingredientsSection,
}) => {
  const [openTimerStep, setOpenTimerStep] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: directions.length,
    initialPage: 1,
    showControls: false,
    siblings: directions.length,
    boundaries: directions.length,
  });

  return (
    <>
      <Button
        color="default"
        size="sm"
        startContent={<FaPlay />}
        className="bg-[#0E793C]  font-medium text-white"
        onPress={() => {
          onOpen(), setPage(1);
        }}
      >
        Börja Laga Mat
      </Button>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <ul className="flex items-start justify-start gap-3">
                  {range.map((page) => {
                    if (typeof page === "number") {
                      return (
                        <li key={page} aria-label={`page ${page}`}>
                          <button
                            className={cn(
                              "h-[10px] w-[50px]",
                              activePage !== page && "bg-[#898989]",
                              activePage === page && "bg-[#4643E2]"
                            )}
                            onClick={(_) => {
                              setPage(page);
                            }}
                          />
                        </li>
                      );
                    }
                  })}
                </ul>
              </ModalHeader>
              <ModalBody>
                <>
                  <h1 className="mb-2 font-semibold md:text-2xl">
                    Steg: {directions?.[activePage - 1]?.mainStepIndex} av&nbsp;
                    {directions.length}
                  </h1>

                  <Checkbox
                    size="lg"
                    color="success"
                    key={directions?.[activePage - 1]?.mainStepIndex}
                    aria-label={directions?.[activePage - 1]?.mainStepValue}
                    classNames={{
                      base: cn(
                        "inline-flex w-full max-w-md bg-content1",
                        "hover:bg-content2 items-center justify-start",
                        "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-success data-[selected=true]:bg-[#E8FAF0]"
                      ),
                      label: "w-full md:text-xl",
                      icon: "text-white",
                    }}
                  >
                    1:&nbsp;
                    {directions?.[activePage - 1]?.mainStepValue}
                  </Checkbox>
                  <Divider className="my-2" />
                  {directions?.[activePage - 1]?.subSteps.map((step) => {
                    return (
                      <div
                        className="mb-3"
                        key={parseInt(
                          directions?.[
                            activePage - 1
                          ]?.mainStepIndex.toString() +
                            step.subStepIndex.toString()
                        )}
                      >
                        <Checkbox
                          size="md"
                          color="success"
                          value={step.subStepValue}
                          defaultChecked={true}
                          classNames={{
                            base: cn(
                              "inline-flex w-full max-w-md bg-content1",
                              "hover:bg-content2 items-center justify-start text-white",
                              "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                              "data-[selected=true]:border-success data-[selected=true]:bg-[#E8FAF0]"
                            ),
                            label: "w-full md:text-xl",
                            icon: "text-white",
                          }}
                        >
                          {step.subStepIndex + 1}:&nbsp;{step.subStepValue}
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
                    );
                  })}
                </>
              </ModalBody>
              <ModalFooter className="mb-2 md:mb-0">
                <IngrediantDialog ingredientsSection={ingredientsSection} />
                <div className="flex flex-1 justify-end">
                  {activePage !== 1 && (
                    <Button
                      onPress={() => onPrevious()}
                      variant="light"
                      className="text-black"
                      color="default"
                      startContent={<MdNavigateBefore className="text-xl" />}
                    >
                      Tillbaka
                    </Button>
                  )}

                  <Button
                    onPress={(_) => {
                      activePage >= directions.length ? onClose() : onNext();
                    }}
                    color={
                      activePage >= directions.length ? "success" : "primary"
                    }
                    className="text-white"
                    endContent={<MdNavigateNext className="text-2xl" />}
                  >
                    {activePage >= directions.length ? "Klar" : "Nästa"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CookModeDialog;
