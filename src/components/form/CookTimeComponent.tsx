import { Input } from "@nextui-org/react";
import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";

interface CookTimeProps {
  control: Control<FormValues>;
}

const CookTimeComponent: React.FC<CookTimeProps> = ({ control }) => {
  return (
    <Controller
      name="cookingTime"
      control={control}
      render={({ field }) => (
        <Input
          radius="none"
          variant="faded"
          aria-label={field.name}
          fullWidth
          label="Tillagningstid (i minuter)"
          type="number"
          onChange={(e) => {
            const newValue = e.target.value;
            field.onChange(newValue !== "" ? Number(newValue) : null);
          }}
          onBlur={field.onBlur}
          size="sm"
        />
      )}
    />
  );
};

export default CookTimeComponent;
