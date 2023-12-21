import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/react";
import { MdOutlineSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FilterDialog from "./FilterDialog";

export interface Filters {
  cookingTime?: string;
  tags: string[];
  ingredients?: string[];
}

export const initialFilters: Filters = {
  tags: [],
  ingredients: [],
};

const SearchBar: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedFilters, setSelectedFilters] =
    useState<Filters>(initialFilters);
  const { control, reset } = useForm({
    defaultValues: {
      search: "",
    },
  });

  useEffect(() => {
    const getFiltersFromSearchParams = () => {
      const params = new URLSearchParams(searchParams);
      const tags = params.get("tags")?.split(",") || [];
      const cookingTime = params.get("cookingTime");

      const filters: Filters = {
        tags: tags,
        cookingTime: cookingTime ? cookingTime : undefined,
      };
      setSelectedFilters(filters);
    };
    reset({
      search: new URLSearchParams(searchParams).get("query") || "",
    });
    getFiltersFromSearchParams();
  }, [reset, searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    term ? params.set("query", term) : params.delete("query");
    void replace(`${pathname}?${params.toString()}`);
  }, 300);

  const onClear = () => {
    setSelectedFilters(initialFilters);
    reset();
    void replace("");
  };

  return (
    <div className="mt-5 flex px-5">
      <Controller
        name="search"
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            placeholder={placeholder}
            onChange={(e) => {
              field.onChange(e);
              handleSearch(e.target.value);
            }}
            value={field.value}
            onClear={() => onClear()}
            startContent={
              <MdOutlineSearch className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
          />
        )}
      />

      <div className="ml-2 flex items-center gap-4">
        <FilterDialog
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </div>
  );
};

export default SearchBar;
