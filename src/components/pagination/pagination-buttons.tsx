import { Button } from "@nextui-org/react";
import { type UseFormGetValues } from "react-hook-form";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { type FormValues } from "../create-recipe-from/from-interface";

interface PaginationButtonsProps {
  onNext: () => void;
  onPrevious: () => void;
  togglePublicationDialog: () => void;
  formErrorHandler: (length?: number, clearError?: boolean) => void;
  getFormValues: UseFormGetValues<FormValues>;
  activePage: number;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  onNext,
  onPrevious,
  togglePublicationDialog,
  getFormValues,
  formErrorHandler,
  activePage,
}) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 w-full border-t-1 border-gray-300 bg-white p-3">
      <div className="mr-4 flex items-center justify-end gap-3">
        {activePage !== 1 && (
          <Button
            onPress={() => onPrevious()}
            variant="light"
            className="text-black"
            color="default"
            startContent={<MdNavigateBefore className="text-xl" />}
          >
            Back
          </Button>
        )}

        <Button
          onPress={(_) => {
            if (getFormValues("name").length >= 3) {
              formErrorHandler(undefined, true);
              activePage >= 6 ? togglePublicationDialog() : onNext();
            } else {
              formErrorHandler(getFormValues("name").length);
            }
          }}
          color={activePage >= 6 ? "success" : "primary"}
          className="text-white"
          endContent={<MdNavigateNext className="text-2xl" />}
        >
          {activePage >= 6 ? "Save" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PaginationButtons;
