/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Card, Text } from "@nextui-org/react";
import CreateCatalogDialog from "./create-catalog-dialog";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const CreateCatalog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card
        onPress={() => setIsOpen(true)}
        isPressable
        isHoverable
        variant="bordered"
        css={{ width: "180px", height: "180px" }}
      >
        <Card.Body className="flex items-center justify-center">
          <Text className="text-center text-2xl text-gray-800">
            Create Catalog
          </Text>

          <FaPlus className="mt-5 text-xl text-gray-800" />
        </Card.Body>
      </Card>
      <CreateCatalogDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default CreateCatalog;
