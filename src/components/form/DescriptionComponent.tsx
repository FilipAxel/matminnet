import { Textarea } from "@nextui-org/react";
import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";

interface DescriptionProps {
  control: Control<FormValues>;
}

const DescriptionComponent: React.FC<DescriptionProps> = ({ control }) => {
  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <Textarea
          label="Description"
          variant="faded"
          radius="none"
          aria-label={field.name}
          fullWidth
          {...field}
          size="lg"
          minRows={2}
          maxRows={8}
        />
      )}
    />
  );
};

export default DescriptionComponent;
