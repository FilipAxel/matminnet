import { Grid, Loading, Spacer } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "~/components/back-button";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeCard from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";

const CatalogsPage = () => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { query } = router;
  const id = query.catalog as string;

  const { data: recipes, isLoading } =
    api.recipe.getRecipeWithCatalogId.useQuery(
      { id },
      { enabled: !!session?.user }
    );

  const { data: catalog, isLoading: isLoadingCatalog } =
    api.catalog.getCatalogWithId.useQuery(
      {
        id,
      },
      { enabled: !!session?.user }
    );

  if (!session?.user) {
    void router.push("/404");
  }

  if (!isLoading) {
    return (
      <>
        <BackButton />
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
          {catalog && !isLoadingCatalog ? (
            <Grid>
              <CreateRecipe name={catalog?.name} />
            </Grid>
          ) : null}

          {searchResults && !isLoading
            ? searchResults.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            : null}
        </Grid.Container>
      </>
    );
  }
};

export default CatalogsPage;
