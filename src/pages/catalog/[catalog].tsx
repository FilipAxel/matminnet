import { Grid, Loading } from "@nextui-org/react";
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

  const { data: fetchedRecipes, isLoading } = api.recipe.getRecipe.useQuery(
    { id },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      {isLoading ? (
        <Grid className="grid h-screen place-items-center">
          <Loading className="mb-10" size="xl" type="points-opacity" />
        </Grid>
      ) : null}
      <Grid.Container
        className="mx-auto flex w-full max-w-[1200px] justify-start"
        gap={2}
      >
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
