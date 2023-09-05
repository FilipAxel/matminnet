/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, CardBody } from "@nextui-org/react";

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
        className="h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px] sm:w-[210px]"
      >
        <CardBody className="flex items-center justify-center">
          <h1 className="text-center text-2xl text-gray-800">
            Create Collection
          </h1>
          <FaPlus className="mt-5 text-xl text-gray-800" />
        </CardBody>
      </Card>
      <CreateCollectionDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CreateCollection;
