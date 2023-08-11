import { Avatar, Card, Grid, Image, Text } from "@nextui-org/react";
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

  console.log(recipe);

  if (!recipe && !isLoading) {
    void router.push("/404");
  }

  if (!isLoading) {
    return (
      <div className="mb-10 max-w-5xl">
        <BackButton />

        <Image
          className="m-auto max-h-[300px] max-w-[200px] rounded-[15px]"
          src={recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp"}
          width={0}
          height={0}
          alt={"hej"}
        />

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
          {recipe?.recipeIngredients?.map((recipeIngredient) => {
            return (
              <Grid key={recipeIngredient.id} xs={11}>
                <Card css={{ mw: "400px" }} variant="flat">
                  <Card.Body className="flex flex-row items-center justify-between">
                    <Text b h2>
                      {recipeIngredient.ingredient.name}
                    </Text>
                    <Text h3 size={15} small>
                      {recipeIngredient?.quantity}&nbsp;
                      {recipeIngredient?.unit}
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
        <p className="mx-5 mb-[60px] mt-5">{recipe?.directions}</p>

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
