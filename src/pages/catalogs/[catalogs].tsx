import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Recipe from "~/components/recipe/recipe";
import { api } from "~/utils/api";

const CatalogsPage = () => {
  const router = useRouter();
  const { query } = router;
  const { data: sessionData } = useSession();

  const type = query?.type as string; // Extract "mat" from the query parameter

  console.log(type);

  const { data: recipes } = api.recipe.getRecipe.useQuery(
    { type },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      {recipes?.map((recipe) => {
        <Recipe key={recipe.id} recipe={recipe} />;
      })}
    </>
  );
};

export default CatalogsPage;
