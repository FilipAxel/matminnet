import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { IoIosListBox } from "react-icons/io";

export interface IngredientsSection {
  ingredientSectionId?: string;
  name: string;
  recipeId: string | null;
  created_at: Date;
  updated_at: Date;
  ingredients: {
    id: string;
    quantity: string | null;
    unit: string | null;
    ingredientId: string;
    ingredientSectionId: string | null;
    created_at: Date;
    updated_at: Date;
    ingredient: {
      name: string;
    };
  }[];
}
export interface IngredientSectionProps {
  ingredientsSection: IngredientsSection[];
}

const IngredientDialog: React.FC<IngredientSectionProps> = ({
  ingredientsSection,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        variant="solid"
        className=""
        color="primary"
        startContent={<IoIosListBox className="text-2xl" />}
      >
        Ingredienser
      </Button>

      <Modal
        placement="auto"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="p-2">
          {(_) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-bold">
                Ingredienser
              </ModalHeader>
              <ModalBody className="mb-2">
                {ingredientsSection.map((section) => (
                  <div key={section.name}>
                    <Divider className="my-4" />
                    <h1 className="text-xl font-semibold">{section.name}</h1>
                    {section.ingredients.map((ingredient) => {
                      const {
                        quantity,
                        unit,
                        ingredient: { name },
                      } = ingredient;
                      return (
                        <div
                          className="flex justify-between p-1"
                          key={ingredient.id}
                        >
                          <h1 className="font-medium">
                            {quantity}&nbsp;{unit}&nbsp;
                          </h1>
                          <h2>{name}</h2>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default IngredientDialog;
