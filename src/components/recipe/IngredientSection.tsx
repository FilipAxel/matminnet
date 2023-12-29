import { Card, CardBody } from "@nextui-org/react";

interface props {
  ingredientStep: {
    id: string;
    name: string;
    ingredients: ({
      ingredient: {
        name: string;
      };
    } & {
      id: string;
      quantity: string | null;
      unit: string | null;
      ingredientId: string;
      created_at: Date;
      updated_at: Date;
      ingredientSectionId: string | null;
    })[];
  };
}

const IngredientSection: React.FC<props> = ({ ingredientStep }) => {
  return (
    <Card key={ingredientStep.id} className="w-full p-4">
      <h2 className="font-semibold">{ingredientStep.name}</h2>
      <CardBody className="flex flex-col items-start">
        {ingredientStep.ingredients.map((ingredient) => (
          <h3 key={ingredient.id} className="text-[16px] text-gray-800">
            - {ingredient.quantity}
            {ingredient.unit}&nbsp;
            {ingredient.ingredient.name}
          </h3>
        ))}
      </CardBody>
    </Card>
  );
};

export default IngredientSection;
