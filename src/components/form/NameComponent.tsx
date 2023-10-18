import { Input } from "@nextui-org/react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";

interface NameProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

const NameComponent: React.FC<NameProps> = ({ control, errors }) => {
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: true,
        maxLength: 40,
        minLength: 3,
      }}
      render={({ field }) => (
        <Input
          size="md"
          radius="none"
          variant="faded"
          isRequired
          errorMessage={
            errors?.name?.type === "required"
              ? "Name is required"
              : "" || errors?.name?.type === "maxLength"
              ? "Name must not exceed 40 characters"
              : "" || errors?.name?.type === "minLength"
              ? "Name must be at least 3 characters"
              : null
          }
          color={
            errors.name?.type === "required"
              ? "danger"
              : errors?.name?.type === "maxLength" ||
                errors?.name?.type === "minLength"
              ? "danger"
              : "default"
          }
          aria-label={field.name}
          label="Name"
          fullWidth
          {...field}
        />
      )}
    />
  );
};

export default NameComponent;
