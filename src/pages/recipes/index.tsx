import { Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoginActionDialog from "~/components/dialog/login-action-dialog";

import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeCard from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const Recipes = () => {
  const { data: session, status } = useSession();

  const [searchResults, setSearchResults] = useState<RecipeWithImage[]>([]);
  const { data: recipes, isLoading } =
    api.recipe.getAllRecipes.useQuery(undefined);

  if (status === "unauthenticated" && !session) {
    return <LoginActionDialog pageName={"Settings"} />;
  }

  if (!recipes?.length && !isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center ">
        <div className="mx-2">
          <Text weight="bold" size={25} h1 className="text-center">
            Oh no! It seems like you haven&apos;t added any recipes yet.
          </Text>
          <Text h2 className="mt-3 text-center">
            Don&apos;t miss out on the fun! Our recipe app is all about
            discovering and sharing delicious dishes. Click below to add your
            very first recipe and become a part of our thriving culinary
            community.
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
        className="mx-auto flex w-full max-w-[1200px] justify-center p-0"
        gap={1}
      >
        <Grid>
          <CreateRecipe />
        </Grid>
        {searchResults.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Grid.Container>
    </>
  );
};

export default Recipes;
