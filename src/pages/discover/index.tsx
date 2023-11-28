import { Spacer, Spinner } from "@nextui-org/react";
import { useState } from "react";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";
import RecipeList from "~/components/recipe/recipe-card";
import { type RecipeWithImage } from "../recipes";

const Discover = () => {
  const [searchResults, setSearchResults] = useState<RecipeWithImage[]>([]);

  const { data: recipes, isLoading } =
    api.recipe.getApprovedPublication.useQuery();

  return (
    <>
      {recipes ? (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <SearchRecipe recipes={recipes} setSearchResults={setSearchResults} />
      ) : null}
      <Spacer y={1} />
      {isLoading ? (
        <div className="grid h-screen place-items-center">
          <Spinner className="mb-10" size="lg" />
        </div>
      ) : null}
      <div className="container mx-auto flex w-full max-w-[1200px] justify-center gap-1">
        {searchResults.map((recipe) => (
          <RecipeList key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
};

export default Discover;
