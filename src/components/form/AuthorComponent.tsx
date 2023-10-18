import { Input } from "@nextui-org/react";
import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";

interface AuthorProps {
  control: Control<FormValues>;
}

const AuthorComponent: React.FC<AuthorProps> = ({ control }) => {
  return (
    <Controller
      name="author"
      control={control}
      render={({ field }) => (
        <Input
          radius="none"
          variant="faded"
          label="Author"
          aria-label={field.name}
          fullWidth
          {...field}
          size="sm"
        />
      )}
    />
  );
};

export default AuthorComponent;
