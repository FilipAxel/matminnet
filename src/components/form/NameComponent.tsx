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
          size="sm"
          radius="none"
          variant="faded"
          isRequired
          errorMessage={
            errors?.name?.type === "required"
              ? "Namn krävs"
              : "" || errors?.name?.type === "maxLength"
              ? "Namnet får inte överskrida 40 tecken"
              : "" || errors?.name?.type === "minLength"
              ? "Namnet måste vara minst 3 tecken"
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
          label="Namn"
          fullWidth
          {...field}
        />
      )}
    />
  );
};

export default NameComponent;
