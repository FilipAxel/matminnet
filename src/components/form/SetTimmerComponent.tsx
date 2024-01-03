import {
  type Control,
  Controller,
  type UseFormSetValue,
} from "react-hook-form";
import { Input } from "@nextui-org/react";
import {
  type FormValues,
  type SetTimmerFormData,
} from "../create-recipe-from/from-interface";

interface SetTimmerProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

const SetTimmerComponent: React.FC<SetTimmerProps> = ({
  control,
  setValue,
}) => {
  const validateAndSetFieldValue = (
    fieldName: keyof SetTimmerFormData,
    value: string,
    min: number,
    max: number
  ) => {
    const intValue = parseInt(value, 10);
    let validValue = isNaN(intValue)
      ? min
      : Math.min(Math.max(intValue, min), max);

    if (intValue > max) {
      validValue = max;
    } else if (intValue < min) {
      validValue = min;
    }

    setValue(`cookingTime.${fieldName}`, validValue);
    const inputElement = document.getElementById(fieldName) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = validValue.toString();
    }
  };

  return (
    <>
      <h1>Tillagningstid</h1>
      <div className="flex border-2 md:w-fit">
        <Controller
          name="cookingTime.hours"
          control={control}
          rules={{ max: 23, min: 0 }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              classNames={{
                input: "text-2xl md:w-[75px]",
                base: "md:w-[140px]",
              }}
              aria-label="hours"
              id="hours"
              min="0"
              value={field.value?.toString() ?? ""}
              radius="none"
              max="23"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">timmar</span>
                </div>
              }
              onChange={(e) => {
                validateAndSetFieldValue("hours", e.target.value, 0, 23);
                field.onChange(e);
              }}
            />
          )}
        />

        <Controller
          name="cookingTime.minutes"
          control={control}
          rules={{ max: 59, min: 0 }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              classNames={{
                input: "text-2xl md:w-[75px]",
                base: "md:w-[140px]",
              }}
              aria-label="minutes"
              id="minutes"
              radius="none"
              min="0"
              max="59"
              value={field.value?.toString() ?? ""}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">min</span>
                </div>
              }
              onChange={(e) => {
                validateAndSetFieldValue("minutes", e.target.value, 0, 59);
                field.onChange(e);
              }}
            />
          )}
        />
      </div>
    </>
  );
};

export default SetTimmerComponent;
