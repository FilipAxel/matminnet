import {
  Dropdown,
  Grid,
  Input,
  Loading,
  Spacer,
  Text,
} from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeList from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";

const Recipes = () => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  const { data: fetchedRecipes, isLoading } =
    api.recipe.getAllRecipes.useQuery();

  if (!fetchedRecipes?.length && !isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center ">
        <div>
          <Text weight="bold" size={40} h1 className="text-center">
            Soory, you dont have any recipes...
          </Text>

          <div className="mt-5 flex justify-center">
            <CreateRecipe />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {fetchedRecipes ? (
        <SearchRecipe
          fetchedRecipes={fetchedRecipes}
          setSearchResults={setSearchResults}
        />
      ) : null}
      <Spacer y={1} />
      {isLoading ? (
        <Grid className="grid h-screen place-items-center">
          <Loading className="mb-10" size="xl" type="points-opacity" />
        </Grid>
      ) : null}
      <Grid.Container
        className="mx-auto flex w-full max-w-[1200px] justify-start"
        gap={2}
      >
        <Grid>
          <CreateRecipe />
        </Grid>
        {searchResults.map((recipe) => (
          <RecipeList key={recipe.id} recipe={recipe} />
        ))}
      </Grid.Container>
    </>
  );
};

export default Recipes;
