import { Button } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";

interface AddStepProps {
  onAddStepClick: () => void; // Callback function when the button is clicked
  stepCount: number;
  text: string;
}

const AddStep: React.FC<AddStepProps> = ({
  onAddStepClick,
  text,
  stepCount,
}) => {
  const handleAddStepClick = () => {
    onAddStepClick();
  };
  return (
    <Button
      variant="solid"
      color="primary"
      radius="sm"
      disabled={stepCount >= 20}
      isDisabled={stepCount >= 20}
      className="h-[40px] w-full text-xl font-bold"
      onClick={handleAddStepClick}
      startContent={<MdAdd className="text-2xl" />}
    >
      {text}
    </Button>
  );
};

export default AddStep;
