import { Spacer, Spinner } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "~/components/shared/back-button";

import SearchRecipe from "~/components/recipe/recipe-search";
import { api } from "~/utils/api";
import RecipeCard from "~/components/recipe/recipe-card";

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
          <div className="grid h-screen place-items-center">
            <Spinner size="lg" className="mb-10" />
          </div>
        ) : null}
        <div className="mx-auto mb-10 mt-4 flex flex-wrap justify-center gap-5 p-0  xs:max-w-[97%]  xs:justify-normal media428:max-w-[88%]  md:justify-normal">
          {searchResults && !isLoading
            ? searchResults.map((recipe: RecipeWithImage) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            : null}
        </div>
      </>
    );
  }
};

export default CollectionPage;
