import { Button, ScrollShadow, cn } from "@nextui-org/react";
import router from "next/router";
import { api } from "~/utils/api";
import SkeletonRecipe from "../skeleton/recipe-skeleton";
import DirectionSection from "./DirectionSection";
import IngredientSection from "./IngredientSection";
import LikeButton from "./LikeButton";
import RecipeImage from "./RecipeImage";
import Video from "./Video";
import ShareButton from "./ShareButton";
import { useState } from "react";
import { MdOutlineTimer } from "react-icons/md";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface RecipeSectionProps {
  id: string;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({ id }) => {
  const { data: session } = useSession();
  const [shadowSize, setShadowSize] = useState(70);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 70 ? 0 : 70));
  };

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

  const { data: likeResponse } = api.recipe.getLikes.useQuery({
    id,
  });

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
        <div className="mx-auto mb-10 max-w-5xl">
          <div className="mt-5 flex flex-wrap lg:flex-row-reverse lg:flex-nowrap lg:justify-end">
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

                <ShareButton />
                <Button size="sm" color="primary" className="text-white">
                  {data?.recipe.publicationStatus &&
                    data.recipe.publicationStatus.charAt(0).toUpperCase() +
                      data.recipe.publicationStatus.slice(1)}
                </Button>
              </div>
              <div className="mb-3 flex gap-2 px-4">
                {data?.recipe?.servingSize && (
                  <h3 className="text-[16px]">
                    {data?.recipe?.servingSize} Portions |
                  </h3>
                )}
                {data?.recipe?.cookingTime && (
                  <h3 className="flex items-center text-[16px]">
                    <MdOutlineTimer className="mr-2" />{" "}
                    {data?.recipe?.cookingTime} Min
                  </h3>
                )}
              </div>
              {data?.recipe?.description && (
                <ScrollShadow
                  hideScrollBar
                  onClick={toggleSize}
                  size={shadowSize}
                  className={cn("mb-8", {
                    "h-[75px]": shadowSize === 70,
                    "h-[165px]": shadowSize === 0,
                  })}
                >
                  <p className="mx-4 mb-5 max-w-[70ch] text-sm text-gray-800">
                    {data?.recipe?.description}
                  </p>
                </ScrollShadow>
              )}

              <div className="justify-left mx-3 my-4 flex flex-wrap gap-2 px-2">
                {data?.recipe.tags.map((tag, index) => (
                  <Button
                    href={`/tag/${tag.tag.name}`}
                    as={Link}
                    color="secondary"
                    size="sm"
                    key={index}
                  >
                    {tag.tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <RecipeImage images={data?.recipe.images} />
          </div>

          <div className="mx-4 ml-2 mt-4 flex flex-wrap justify-center lg:mt-8 lg:flex-nowrap lg:justify-normal">
            {data?.recipe.ingredientsSection.length ? (
              <div className="flex w-full max-w-[400px] flex-col">
                <h2 className="mb-2 text-center text-[25px] font-bold lg:text-left">
                  Ingredients
                </h2>
                {data?.recipe.ingredientsSection.map((ingredientStep) => {
                  return (
                    <IngredientSection
                      key={ingredientStep.id}
                      ingredientStep={ingredientStep}
                    />
                  );
                })}
              </div>
            ) : null}

            {data?.recipe.directions.length ? (
              <div>
                <h2 className="mt-4 text-center text-[25px] font-bold lg:ml-5 lg:mt-0 lg:text-left">
                  Directions
                </h2>
                <div className="flex w-full max-w-[450px] flex-col items-center justify-center gap-3 overflow-hidden p-2 pb-5 lg:max-w-[600px]">
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
