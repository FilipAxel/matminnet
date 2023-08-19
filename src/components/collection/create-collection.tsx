/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, Text } from "@nextui-org/react";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CreateCollectionDialog from "../dialog/create-collection-dialog";

const CreateCollection = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card
        onPress={() => setIsOpen(true)}
        isPressable
        isHoverable
        variant="bordered"
        className="sm:w-[210px] h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px]"
      >
        <Card.Body className="flex items-center justify-center">
          <Text className="text-center text-2xl text-gray-800">
            Create Collection
          </Text>

          <FaPlus className="mt-5 text-xl text-gray-800" />
        </Card.Body>
      </Card>
      <CreateCollectionDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CreateCollection;
