import { Grid, Loading, Spacer } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "~/components/shered/back-button";
import CreateRecipe from "~/components/recipe/create-recipe";
import RecipeCard from "~/components/recipe/recipe-card";
import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const CollectionPage = () => {
  const [searchResults, setSearchResults] = useState<RecipeWithImage[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { query } = router;
  const id = query.collection as string;

  const { data: recipes, isLoading } =
    api.recipe.getRecipesOnCollection.useQuery(
      { id },
      { enabled: !!session?.user }
    );

  const { data: collection, isLoading: isLoadingCollection } =
    api.collection.getCollectionWithId.useQuery(
      {
        id,
      },
      { enabled: !!session?.user }
    );
  useEffect(() => {
    if (!session?.user && !isLoading) {
      void router.push("/404");
    }
  }, [router, session?.user, isLoading]);

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
          {collection && !isLoadingCollection ? (
            <Grid>
              <CreateRecipe name={collection?.name} />
            </Grid>
          ) : null}

          {searchResults && !isLoading
            ? searchResults.map((recipe: RecipeWithImage) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            : null}
        </Grid.Container>
      </>
    );
  }
};

export default CollectionPage;
