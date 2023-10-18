import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import { MdOutlineSettings, MdDeleteForever } from "react-icons/md";

interface IngredientDropDownProps {
  onDelete: () => void;
}

const IngredientDropDown: React.FC<IngredientDropDownProps> = ({
  onDelete,
}) => {
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

export default IngredientDropDown;
