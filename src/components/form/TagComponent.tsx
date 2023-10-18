import { type Control, Controller } from "react-hook-form";
import TagsController from "../create-recipe-from/tags.controller";
import { type FormValues } from "../create-recipe-from/from-interface";
import { ScrollShadow, cn } from "@nextui-org/react";
import { useState } from "react";

interface TagComponentProps {
  control: Control<FormValues>;
  getValues: () => FormValues;
}

const TagComponent: React.FC<TagComponentProps> = ({ control, getValues }) => {
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  return (
    <div className="my-10">
      <h1 className="mb-5 text-4xl font-semibold">Tags</h1>

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
          Tags help you categorize your recipes based on various criteria. For
          instance, you can tag a recipe as &quot;Quick and Easy,&quot;
          &quot;Vegetarian,&quot; &quot;Italian,&quot; or &quot;Weeknight
          Dinner.&quot; This makes it incredibly easy to find specific recipes
          later on, especially when your collection grows.
        </p>
      </ScrollShadow>

      <div className="w-full">
        <Controller
          name="tags"
          render={({ field }) => {
            const currentValue = getValues().tags || [];
            return <TagsController field={field} currentValue={currentValue} />;
          }}
          control={control}
        />
      </div>
    </div>
  );
};

export default TagComponent;
