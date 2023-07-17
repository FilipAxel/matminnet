/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, Text } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CreateRecipeDialog from "../dialog/create-recipe-dialog";

interface createRecipeProps {
  name?: string;
}

const CreateRecipe: React.FC<createRecipeProps> = ({ name }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card
        onPress={() => setIsOpen(true)}
        isPressable
        isHoverable
        variant="bordered"
        className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]"
      >
        <Card.Body className="flex items-center justify-center">
          <Text className="text-center text-2xl text-gray-800">
            Create Recipe
          </Text>

          <FaPlus className="mt-5 text-xl text-gray-800" />
        </Card.Body>
      </Card>
      <CreateRecipeDialog
        catalogName={name}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default CreateRecipe;
