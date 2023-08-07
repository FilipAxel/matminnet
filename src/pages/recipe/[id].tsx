import { Avatar, Card, Grid, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import BackButton from "~/components/shered/back-button";
import { api } from "~/utils/api";

const Recipe = () => {
  const router = useRouter();
  const { query } = router;
  const id = query.id as string;

  const { data: recipe, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  if (!recipe && !isLoading) {
    void router.push("/404");
  }

  if (!isLoading) {
    return (
      <div className="max-w-5xl">
        <BackButton />
        <Grid>
          <Avatar
            className="m-auto h-[250px] w-[250px] object-fill"
            src={recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp"}
          />
        </Grid>

        <Text h1 size={30} className="mt-5 text-center" weight="bold">
          {recipe?.name}
        </Text>

        <div className="mt-5 flex flex-row items-center justify-between">
          <Text h2 size={25} className="ml-4" weight="bold">
            Ingredients
          </Text>
          <Text className="mr-4" h3 size={20}>
            Serving size: {recipe?.servingSize}
          </Text>
        </div>
        <Grid.Container className="mt-4" gap={1} justify="center">
          {recipe?.RecipeIngredient.map((ingredient) => {
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
        <p className="m-5">{recipe?.direction}</p>

        {recipe?.video && (
          <div className="aspect-h-9 aspect-w-16 m-5 flex justify-center">
            <iframe
              src={recipe?.video || ""}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    );
  }
};

export default Recipe;
