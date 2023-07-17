import { Dropdown, Input } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Key = string | number;

interface SearchRecipeProps {
  fetchedRecipes: Recipe[];
  setSearchResults: (results: Recipe[]) => void;
}

const SearchRecipe: React.FC<SearchRecipeProps> = ({
  fetchedRecipes,
  setSearchResults,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const results = fetchedRecipes?.filter((recipe) =>
      recipe?.name.toLowerCase().includes(searchTerm)
    );

    const sortedResults = results ? [...results] : [];
    if (sortOrder === "asc") {
      sortedResults.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sortedResults.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSearchResults(sortedResults);
  }, [searchTerm, fetchedRecipes, sortOrder, setSearchResults]);

  const {
    control,
    formState: { errors },
  } = useForm({
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
    <form className="mr-5 flex justify-end" onChange={handleChange}>
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
          <Dropdown.Item key="asc">Asc</Dropdown.Item>
          <Dropdown.Item key="desc">Desc</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </form>
  );
};

export default SearchRecipe;
