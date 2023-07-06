import { Grid } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CreateRecipe from "~/components/recipe/create-recipe";
import Recipe from "~/components/recipe/recipe";
import { api } from "~/utils/api";

const CatalogsPage = () => {
  const router = useRouter();
  const { query } = router;
  const { data: sessionData } = useSession();
  const id = query.catalog as string;

  const { data: fetchedRecipes } = api.recipe.getRecipe.useQuery(
    { id },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      <Grid.Container alignItems="flex-start" gap={2}>
        <Grid>
          <CreateRecipe catalogId={id} />
        </Grid>
        {fetchedRecipes
          ? fetchedRecipes.map((r) => <Recipe key={r.id} recipe={r} />)
          : null}
      </Grid.Container>
    </>
  );
};

export default CatalogsPage;
