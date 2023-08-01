import { Spacer, Grid, Loading } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useState } from "react";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";
import RecipeList from "~/components/recipe/recipe-card";

const Public = () => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  const { data: recipes, isLoading } =
    api.recipe.getApprovedPublication.useQuery();

  return (
    <>
      {recipes ? (
        <SearchRecipe recipes={recipes} setSearchResults={setSearchResults} />
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
        {searchResults.map((recipe) => (
          <RecipeList key={recipe.id} recipe={recipe} />
        ))}
      </Grid.Container>
    </>
  );
};

export default Public;
