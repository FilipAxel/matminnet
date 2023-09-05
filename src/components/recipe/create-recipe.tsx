/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, CardBody } from "@nextui-org/react";
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
        className="sm:w-[210px] h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px]"
      >
        <CardBody className="flex items-center justify-center">
          <h1 className="text-center text-2xl text-gray-800">Create Recipe</h1>

          <FaPlus className="mt-5 text-xl text-gray-800" />
        </CardBody>
      </Card>

      {isOpen ? (
        <CreateRecipeDialog
          collectionName={name}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      ) : null}
    </>
  );
};

export default CreateRecipe;
