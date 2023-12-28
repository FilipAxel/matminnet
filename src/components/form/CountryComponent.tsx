import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "../create-recipe-from/from-interface";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { type Country } from "@prisma/client";

interface CountryProps {
  control: Control<FormValues>;
  countrys: Country[];
}

const CountryComponent: React.FC<CountryProps> = ({ control, countrys }) => {
  return (
    <Controller
      name="country"
      control={control}
      render={({ field }) => (
        <Select
          radius="none"
          variant="bordered"
          className="w-full"
          selectionMode="single"
          label="Välj Land"
          items={countrys}
          onChange={(e) => field.onChange(e.target.value)}
          classNames={{
            label: "group-data-[filled=true]:-translate-y-5",
            trigger: "min-h-unit-16",
          }}
          listboxProps={{
            itemClasses: {
              base: ["rounded-md", "text-default-500", "transition-opacity"],
            },
          }}
          popoverProps={{
            classNames: {
              base: "before:bg-default-200",
              content: "p-0 border-small border-divider bg-background",
            },
          }}
          renderValue={(items) => {
            return items.map((item) => (
              <div key={item.key} className="my-2 flex items-center gap-2">
                <Avatar
                  alt={item.data?.countryCode}
                  className="h-6 w-6"
                  src={`https://flagcdn.com/h20/${
                    item.data?.countryCode as string
                  }.png`}
                />
                {item.data?.name}
              </div>
            ));
          }}
        >
          {(country) => (
            <SelectItem
              key={country.name}
              textValue={country.name}
              startContent={
                <Avatar
                  alt={country.name}
                  className="h-6 w-6"
                  src={`https://flagcdn.com/h20/${country.countryCode}.png`}
                />
              }
            >
              {country.name}
            </SelectItem>
          )}
        </Select>
      )}
    />
  );
};

export default CountryComponent;
