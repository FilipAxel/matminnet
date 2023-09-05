import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type RecipeWithImage } from "~/pages/recipes";

type Key = string | number;

interface SearchRecipeProps {
  recipes: RecipeWithImage[];
  setSearchResults: (results: RecipeWithImage[]) => void;
}

const SearchRecipe: React.FC<SearchRecipeProps> = ({
  recipes,
  setSearchResults,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("A-Z");

  useEffect(() => {
    const results = recipes?.filter((recipe) =>
      recipe?.name.toLowerCase().includes(searchTerm)
    );

    const sortedResults = results ? [...results] : [];
    if (sortOrder === "A-Z") {
      sortedResults.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "Z-A") {
      sortedResults.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSearchResults(sortedResults);
  }, [searchTerm, recipes, sortOrder, setSearchResults]);

  const { control } = useForm({
    defaultValues: {
      recipeSearch: "",
    },
  });

  const handleChange = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const newSearchTerm: string = event.target.value;
    if (newSearchTerm !== searchTerm) {
      setSearchTerm(newSearchTerm?.toLowerCase());
    }
  };

  const handleSortChange = (option: Key) => {
    if (option === sortOrder) return;
    setSortOrder(option.toString());
  };

  return (
    <form className="mr-5 mt-2 flex justify-end" onChange={handleChange}>
      <Controller
        name="recipeSearch"
        control={control}
        render={({ field }) => (
          <Input
            aria-label={field.name}
            variant="faded"
            className="mr-5 w-[200px] md:w-[350px]"
            placeholder={"Search..."}
            {...field}
            size="md"
          />
        )}
      />

      <Dropdown>
        <DropdownTrigger className="bg-[#b195d2]">
          <Button className="text-white" variant="bordered">
            {sortOrder}
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          onAction={(key) => handleSortChange(key)}
          aria-label="Static Actions"
        >
          <DropdownItem key="A-Z">A-Z</DropdownItem>
          <DropdownItem key="Z-A">Z-A</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </form>
  );
};

export default SearchRecipe;
