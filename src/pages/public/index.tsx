import { Spacer, Grid, Loading } from "@nextui-org/react";
import { useState } from "react";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";
import RecipeList from "~/components/recipe/recipe-card";
import { type RecipeWithImage } from "../recipes";

const Public = () => {
  const [searchResults, setSearchResults] = useState<RecipeWithImage[]>([]);

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
        className="mx-auto flex w-full max-w-[1200px] justify-center"
        gap={1}
      >
        {searchResults.map((recipe) => (
          <RecipeList key={recipe.id} recipe={recipe} />
        ))}
      </Grid.Container>
    </>
  );
};

export default Public;
