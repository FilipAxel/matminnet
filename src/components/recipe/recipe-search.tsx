import { Dropdown, Input } from "@nextui-org/react";
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
            bordered
            className="pr-2"
            placeholder={"Search..."}
            {...field}
            size="md"
          />
        )}
      />

      <Dropdown>
        <Dropdown.Button className="bg-blue-500" color="primary" auto>
          {sortOrder}
        </Dropdown.Button>
        <Dropdown.Menu
          onAction={(option) => handleSortChange(option)}
          aria-label="Static Actions"
        >
          <Dropdown.Item key="A-Z">A-Z</Dropdown.Item>
          <Dropdown.Item key="Z-A">Z-A</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </form>
  );
};

export default SearchRecipe;
