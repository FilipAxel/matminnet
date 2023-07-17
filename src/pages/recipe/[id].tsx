import { Avatar, Card, Grid, Text } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdArrowCircleLeft } from "react-icons/md";
import { api } from "~/utils/api";

const Recipe = () => {
  const router = useRouter();
  const { query } = router;
  const goBack = () => router.back();

  const { data: sessionData } = useSession();
  const id = query.id as string;

  const { data: fetchedRecipe, isLoading } =
    api.recipe.getRecipeWithId.useQuery(
      { id },
      { enabled: sessionData?.user !== undefined }
    );

  return (
    <div className="max-w-5xl">
      <MdArrowCircleLeft
        className="mb-5 ml-5 text-4xl hover:cursor-pointer"
        onClick={goBack}
      />
      <Grid>
        <Avatar
          className="m-auto h-[250px] w-[250px]"
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
        />
      </Grid>

      <Text h1 size={30} className="mt-5 text-center" weight="bold">
        {fetchedRecipe?.name}
      </Text>

      <div className="mt-5 flex flex-row items-center justify-between">
        <Text h2 size={25} className="ml-4" weight="bold">
          Ingredients
        </Text>
        <Text className="mr-4" h3 size={20}>
          Serving size: {fetchedRecipe?.servingSize}
        </Text>
      </div>
      <Grid.Container className="mt-4" gap={1} justify="center">
        {fetchedRecipe?.RecipeIngredient.map((ingredient) => {
          return (
            <Grid key={ingredient.id} xs={11}>
              <Card css={{ mw: "400px" }} variant="flat">
                <Card.Body className="flex flex-row items-center justify-between">
                  <Text b h2>
                    {ingredient?.ingredient.name}
                  </Text>
                  <Text h3 size={15} small>
                    {ingredient?.quantity}
                    {ingredient?.unit}
                  </Text>
                </Card.Body>
              </Card>
            </Grid>
          );
        })}
      </Grid.Container>

      <Text h2 size={25} className="ml-4 mt-5" weight="bold">
        Directions
      </Text>
      <p className="m-5">{fetchedRecipe?.direction}</p>

      {fetchedRecipe?.video && (
        <div className="aspect-h-9 aspect-w-16 m-5 flex justify-center">
          <iframe
            src={fetchedRecipe?.video || ""}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Recipe;
