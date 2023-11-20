import { Spacer } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoginActionDialog from "~/components/dialog/login-action-dialog";

import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeCard from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import SkeletonRecipeCard from "~/components/skeleton/recipe-card-skeletion";
import { api } from "~/utils/api";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const Recipes = () => {
  const { data: session, status } = useSession();

  const [searchResults, setSearchResults] = useState<RecipeWithImage[]>([]);
  const { data: recipes, isLoading } =
    api.recipe.getAllRecipesForUser.useQuery();

  if (status === "unauthenticated" && !session) {
    return <LoginActionDialog />;
  }

  if (!recipes?.length && !isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center ">
        <div className="mx-2">
          <h1 className="text-center font-normal">
            Oh no! It seems like you haven&apos;t added any recipes yet.
          </h1>

          <div className="mt-5 flex justify-center">
            <CreateRecipe />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {recipes && !isLoading && (
        <SearchRecipe recipes={recipes} setSearchResults={setSearchResults} />
      )}
      <Spacer y={1} />
      {isLoading ? (
        <div className="container mx-auto mb-10 mt-4 flex flex-wrap justify-center gap-5 p-0  xs:max-w-[90%]  xs:justify-normal media428:max-w-[88%]  md:justify-normal">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            return <SkeletonRecipeCard key={n} />;
          })}
        </div>
      ) : (
        <div className="mx-auto mb-10 mt-4 flex flex-wrap justify-center gap-5 p-0  xs:max-w-[90%]  xs:justify-normal media428:max-w-[88%]  md:justify-normal">
          <div className="w-full xs:w-auto">
            <CreateRecipe />
          </div>
          {searchResults.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
};

export default Recipes;
