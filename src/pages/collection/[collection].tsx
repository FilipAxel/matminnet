import { type Recipe } from "@prisma/client";
import { useRouter } from "next/router";
import RecipeSearch from "~/components/RecipeSearch";
import SearchList from "~/components/SearchList";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const CollectionPage = () => {
  const router = useRouter();
  const { collection } = router.query;

  return (
    <>
      <RecipeSearch placeholder="Search Recipes..." />
      {collection && (
        <SearchList publicSearch={false} collection={collection as string} />
      )}
    </>
  );
};

export default CollectionPage;
