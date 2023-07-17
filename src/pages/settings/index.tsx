/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input } from "@nextui-org/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  searchName: string;
}

const Settings = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchName: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) => {
    console.log("you submited");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="searchName"
        control={control}
        rules={{
          required: true,
          maxLength: 20,
          minLength: 3,
        }}
        render={({ field }) => (
          <Input
            aria-label={field.name}
            helperText={
              errors?.searchName?.type === "required"
                ? "Input is required"
                : "" || errors?.searchName?.type === "maxLength"
                ? "name must not exceed 100 characters"
                : ""
            }
            helperColor={
              errors.searchName?.type === "required"
                ? "error"
                : "primary" || errors?.searchName?.type === "maxLength"
                ? "error"
                : "primary"
            }
            color={errors.searchName?.type === "required" ? "error" : "primary"}
            clearable
            bordered
            fullWidth
            placeholder={field.name}
            {...field}
            size="lg"
          />
        )}
      />
    </form>
  );
};

export default Settings;
