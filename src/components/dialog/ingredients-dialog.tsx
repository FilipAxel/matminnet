import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { SiReadthedocs } from "react-icons/si";

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
        variant="light"
        className="text-black"
        color="default"
        startContent={<SiReadthedocs className="text-xl" />}
      >
        Ingredienser
      </Button>

      <Modal placement="auto" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(_) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ingredienser
              </ModalHeader>
              <ModalBody>
                {ingredientsSection.map((section) => {
                  return section.ingredients.map((ingredient) => {
                    const {
                      quantity,
                      unit,
                      ingredient: { name },
                    } = ingredient;
                    return (
                      <div className="flex" key={ingredient.id}>
                        <h1 className="font-semibold">
                          {quantity}&nbsp;{unit}&nbsp;
                        </h1>
                        <h2>{name}</h2>
                      </div>
                    );
                  });
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default IngredientDialog;
