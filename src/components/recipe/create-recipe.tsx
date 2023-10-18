/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, CardBody } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/router";

/* interface createRecipeProps {
  name?: string;
} */

const CreateRecipe = () => {
  const router = useRouter();

  const handleClick = () => {
    void router.push("/recipes/create");
  };

  return (
    <>
      <Card
        onPress={(_) => handleClick()}
        isPressable
        isHoverable
        className="h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px] sm:w-[210px]"
      >
        <CardBody className="flex items-center justify-center">
          <h1 className="text-center text-2xl text-gray-800">Create Recipe</h1>

          <FaPlus className="mt-5 text-xl text-gray-800" />
        </CardBody>
      </Card>
    </>
  );
};

export default CreateRecipe;
