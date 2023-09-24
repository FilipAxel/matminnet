import { ScrollShadow, Spacer, cn } from "@nextui-org/react";
import { type Control, Controller } from "react-hook-form";
import CollectionController from "../create-recipe-from/collection-controller";
import {
  type CollectionOption,
  type FormValues,
} from "../create-recipe-from/from-interface";
import { useState } from "react";

interface CollectionProps {
  control: Control<FormValues>;
  currentValue: CollectionOption[];
}

const CollectionComponent: React.FC<CollectionProps> = ({
  control,
  currentValue,
}) => {
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  return (
    <div className="my-10">
      <h1 className="mb-5 text-4xl font-semibold">Add Recipe to Collections</h1>
      <ScrollShadow
        hideScrollBar
        onClick={toggleSize}
        size={shadowSize}
        className={cn("mb-8", {
          "h-[65px]": shadowSize === 50,
          "h-[140px]": shadowSize === 0,
        })}
      >
        <p className="mb-5 max-w-[70ch] text-sm text-gray-500">
          Organize your recipes by adding them to one or more collections.
          Collections are like folders where you can store recipes based on
          themes, occasions, or your preferences. Whether it&apos;s your
          &quot;Summer Food Collection&quot; or &quot;Quick Weeknight
          Meals,&quot; grouping recipes makes it easier to find and enjoy your
          culinary creations. Select or create collections below and start
          curating your recipe library.
        </p>
      </ScrollShadow>

      <Spacer y={0.5} />
      <Controller
        name="collections"
        render={({ field }) => {
          return (
            <CollectionController field={field} currentValue={currentValue} />
          );
        }}
        control={control}
      />
    </div>
  );
};

export default CollectionComponent;
