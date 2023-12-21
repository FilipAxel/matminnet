import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "../create-recipe-from/from-interface";
import { Input } from "@nextui-org/react";

interface CountryProps {
  control: Control<FormValues>;
}

const CountryComponent: React.FC<CountryProps> = ({ control }) => {
  return (
    <Controller
      name="country"
      control={control}
      render={({ field }) => (
        <Input
          isClearable
          radius="none"
          variant="faded"
          label="Land"
          aria-label={field.name}
          fullWidth
          {...field}
          size="sm"
        />
      )}
    />
  );
};

export default CountryComponent;
