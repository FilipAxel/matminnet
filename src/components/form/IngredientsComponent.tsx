import { ScrollShadow, Spacer, cn } from "@nextui-org/react";
import { useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";
import IngredientsController from "~/components/create-recipe-from/ingredients-controller";

interface IngredientsComponent {
  control: Control<FormValues>;
  getValues: () => FormValues;
}

const IngredientsComponent: React.FC<IngredientsComponent> = ({
  control,
  getValues,
}) => {
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  return (
    <div className="my-10">
      <h1 className="mb-5 text-4xl font-semibold">Add Ingredients</h1>

      <ScrollShadow
        hideScrollBar
        onClick={toggleSize}
        size={shadowSize}
        className={cn("mb-8", {
          "h-[65px]": shadowSize === 50,
          "h-[100px]": shadowSize === 0,
        })}
      >
        <p className="mb-5 max-w-[70ch] text-sm text-gray-500">
          Ensure your recipe is complete by adding all the necessary
          ingredients. Each ingredient can be customized with quantity and units
          to make your recipe as precise as possible. Begin by selecting or
          creating ingredients below, and don&apos;t forget to specify
          quantities and units as needed.
        </p>
      </ScrollShadow>

      <Spacer y={0.5} />

      <Controller
        name="ingredients"
        render={({ field }) => {
          const currentValue = getValues().ingredients || [];
          return (
            <IngredientsController field={field} currentValue={currentValue} />
          );
        }}
        control={control}
      />
    </div>
  );
};

export default IngredientsComponent;
