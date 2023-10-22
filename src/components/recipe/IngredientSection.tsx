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
    <div className="grid" key={ingredientStep.id}>
      <Card className="w-full max-w-[400px] p-4">
        <h2 className="font-semibold">{ingredientStep.name}</h2>
        <CardBody className="flex flex-col items-start">
          {ingredientStep.ingredients.map((ingredient) => (
            <div
              className="flex w-full flex-row items-center justify-between"
              key={ingredient.id}
            >
              <h2 className="font-normal text-gray-800">
                {ingredient.ingredient.name}
              </h2>
              <h3 className="text-[15px] font-semibold text-gray-800">
                {ingredient.quantity} {ingredient.unit}
              </h3>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default IngredientSection;
