import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "../create-recipe-from/from-interface";
import { Input } from "@nextui-org/react";

interface ServingSizeProps {
  control: Control<FormValues>;
}

const ServingSizeComponent: React.FC<ServingSizeProps> = ({ control }) => {
  return (
    <Controller
      name="servingSize"
      control={control}
      render={({ field }) => (
        <Input
          radius="none"
          variant="faded"
          aria-label={field.name}
          fullWidth
          label="Serveringsstorlek"
          type="text"
          {...field}
          size="sm"
        />
      )}
    />
  );
};

export default ServingSizeComponent;
