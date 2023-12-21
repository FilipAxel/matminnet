import { Textarea } from "@nextui-org/react";
import { useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "~/components/create-recipe-from/from-interface";

interface DescriptionProps {
  control: Control<FormValues>;
}

const DescriptionComponent: React.FC<DescriptionProps> = ({ control }) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <Controller
      name="description"
      control={control}
      rules={{
        maxLength: 350,
      }}
      render={({ field }) => (
        <>
          <Textarea
            label="Beskrivning"
            variant="faded"
            radius="none"
            aria-label={field.name}
            isInvalid={charCount >= 350}
            fullWidth
            {...field}
            size="lg"
            minRows={2}
            maxRows={8}
            errorMessage={
              charCount >= 350
                ? "Beskrivningen bör vara max 350 tecken lång."
                : undefined
            }
            onChange={(e) => {
              const value = e.target.value.slice(0, 350); // Limit to 350 characters
              field.onChange(value);
              setCharCount(value.length);
            }}
          />
          {/*           <p>{`Characters left: ${350 - charCount}`}</p> */}
        </>
      )}
    />
  );
};

export default DescriptionComponent;
