import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { api } from "~/utils/api";
import SkeletonRecipe from "../skeleton/recipe-skeleton";
import DirectionSection from "./DirectionSection";
import IngredientSection from "./IngredientSection";
import LikeButton from "./LikeButton";
import RecipeImage from "./RecipeImage";
import Video from "./Video";
import { MdOutlineTimer } from "react-icons/md";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CookModeDialog from "../dialog/cook-mode-dialog";
import { useRouter } from "next/router";

const RecipeSection = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { data, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  const { data: userLikedRecipe, refetch } =
    api.recipe.getUserRecipeLike.useQuery(
      { id },
      {
        refetchOnWindowFocus: false,
        enabled: false,
      }
    );

  if (session?.user.id) {
    void refetch();
  }

  const { data: likeResponse } = api.recipe.getLikes.useQuery(
    {
      id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <SkeletonRecipe />;
  }

  // TODO recipe schould not be return if the recipe is not publish or the user created the recipe is viewing it.
  if (
    data?.recipe.publicationStatus !== "published" &&
    data?.recipe.userId !== session?.user.id &&
    !isLoading
  ) {
    void router.push("/404");
  } else {
    return (
      <>
        <div className="mx-auto mb-10 mt-0 max-w-5xl">
          <Breadcrumbs
            classNames={{
              base: "w-full bg-default-100 mt-0",
            }}
            radius="none"
            variant="solid"
            className="w-full pl-2"
          >
            <BreadcrumbItem href={"/discover"}>Recept</BreadcrumbItem>
            <BreadcrumbItem href={router.asPath}>
              {data?.recipe.name}
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="mt-5 flex flex-wrap md:flex-row-reverse md:flex-nowrap md:justify-end">
            <div className="w-full lg:w-[70%]">
              <h1 className="mt-2 w-full px-4 text-left text-[36px] font-bold text-[#3A3A3A]">
                {data?.recipe.name}
              </h1>
              <div className="my-3 flex items-center gap-3 px-4">
                <LikeButton
                  recipeId={id}
                  likes={likeResponse?.likes}
                  userLikedRecipe={userLikedRecipe?.userLikesRecipe}
                />
                {/*  add back when we have this feature */}
                {/* <ShareButton /> */}

                <Button size="sm" color="primary" className="text-white">
                  {data?.recipe.publicationStatus &&
                    data.recipe.publicationStatus.charAt(0).toUpperCase() +
                      data.recipe.publicationStatus.slice(1)}
                </Button>
                {data?.recipe.directions ? (
                  <CookModeDialog
                    directions={data?.recipe.directions}
                    ingredientsSection={data?.recipe.ingredientsSection}
                  />
                ) : null}
              </div>
              <div className="mb-3 flex gap-2 px-4">
                {data?.recipe?.servingSize && (
                  <h3 className="text-[16px]">
                    {data?.recipe?.servingSize} Portioner |
                  </h3>
                )}
                {data?.recipe?.cookingTimeMinutes ||
                data?.recipe?.cookingTimeHours ? (
                  <h3 className="flex items-center text-[16px]">
                    <MdOutlineTimer className="mr-2" />
                    {data?.recipe?.cookingTimeHours && (
                      <span>{data?.recipe?.cookingTimeHours}&nbsp;tim</span>
                    )}
                    &nbsp;
                    {data?.recipe?.cookingTimeMinutes && (
                      <span>{data?.recipe?.cookingTimeMinutes}&nbsp;min</span>
                    )}
                  </h3>
                ) : null}
              </div>
              {data?.recipe?.description && (
                <p className="mx-4 mb-5 max-w-[70ch] text-sm text-gray-800">
                  {data?.recipe?.description}
                </p>
              )}

              <div className="justify-left mx-3 my-4 flex flex-wrap gap-2">
                {data?.recipe.tags.map((tag, index) => (
                  <Button
                    href={`/discover?tags=${tag.name}`}
                    as={Link}
                    color="primary"
                    size="sm"
                    className="font-semibold"
                    key={index}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <RecipeImage images={data?.recipe.images} />
          </div>

          <div className="mx-2 mt-4 flex flex-wrap justify-center md:mt-8 md:flex-nowrap md:justify-normal">
            {data?.recipe.ingredientsSection.length ? (
              <div className="flex w-full flex-col md:max-w-[500px]">
                <h2 className="mb-2 text-center text-[30px] font-bold md:text-left">
                  Ingredienser
                </h2>
                <div className="flex flex-col gap-2">
                  {data?.recipe.ingredientsSection.map((ingredientStep) => {
                    return (
                      <IngredientSection
                        key={ingredientStep.id}
                        ingredientStep={ingredientStep}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {data?.recipe.directions.length ? (
              <div>
                <h2 className="mt-4 text-center text-[30px] font-bold md:ml-5 md:mt-0 md:text-left">
                  Gör så här
                </h2>
                <div className="flex w-full flex-col items-center justify-center gap-3 overflow-hidden p-2 pb-5 lg:max-w-[600px]">
                  {data?.recipe.directions.map((direction) => {
                    return (
                      <DirectionSection
                        key={direction.id}
                        direction={direction}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {data?.recipe.video && <Video video={data?.recipe.video} />}
        </div>
      </>
    );
  }
};

export default RecipeSection;
