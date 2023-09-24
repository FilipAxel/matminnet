import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import {
  MdOutlineSettings,
  MdAccessTime,
  MdDeleteForever,
} from "react-icons/md";

interface StepDropDownProps {
  onOpen: () => void;
  onDelete: () => void;
}

const StepDropDown: React.FC<StepDropDownProps> = ({ onOpen, onDelete }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" variant="solid" className="min-w-[10px]">
          <MdOutlineSettings className="h-[20px] w-[20px] text-white" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown Variants"
        color="default"
        variant="solid"
      >
        <DropdownSection title="Actions">
          <DropdownItem
            showDivider
            startContent={<MdAccessTime />}
            onPress={onOpen}
            className="text-2xl"
            key="time"
            description="let user track time for this task."
          >
            Add timer
          </DropdownItem>
        </DropdownSection>

        <DropdownSection title="Danger">
          <DropdownItem
            startContent={<MdDeleteForever />}
            key="delete"
            className="text-2xl text-danger"
            color="danger"
            onClick={() => onDelete()}
          >
            Delete Task
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default StepDropDown;
