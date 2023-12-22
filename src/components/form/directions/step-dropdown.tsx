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
        <DropdownSection title="Åtgärder">
          <DropdownItem
            showDivider
            startContent={<MdAccessTime />}
            onPress={onOpen}
            className="text-2xl"
            key="time"
            description="Låt användaren följa tiden för denna uppgift."
          >
            Lägg till timer
          </DropdownItem>
        </DropdownSection>

        <DropdownSection title="Farligt">
          <DropdownItem
            startContent={<MdDeleteForever />}
            key="delete"
            className="text-2xl text-danger"
            color="danger"
            onClick={() => onDelete()}
          >
            Ta bort uppgiften
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default StepDropDown;
