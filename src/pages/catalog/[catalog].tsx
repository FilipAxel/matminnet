import { Grid, Loading, Spacer } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdArrowCircleLeft } from "react-icons/md";
import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeCard from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";

const CatalogsPage = () => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { query } = router;
  const id = query.catalog as string;

  const { data: fetchedRecipes, isLoading } =
    api.recipe.getRecipeWithCatalogId.useQuery(
      { id },
      { enabled: sessionData?.user !== undefined }
    );

  const goBack = () => router.back();

  const { data: fetchedCatalog, isLoading: isLoadingCatalog } =
    api.catalog.getCatalogWithId.useQuery(
      {
        id,
      },
      { enabled: id ? true : false }
    );

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
      <MdArrowCircleLeft
        className="mb-5 ml-5 text-4xl hover:cursor-pointer"
        onClick={goBack}
      />
      <Grid.Container
        className="mx-auto flex w-full max-w-[1200px] justify-start"
        gap={2}
      >
        {fetchedCatalog && !isLoadingCatalog ? (
          <Grid>
            <CreateRecipe name={fetchedCatalog?.name} />
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
};

export default CatalogsPage;
