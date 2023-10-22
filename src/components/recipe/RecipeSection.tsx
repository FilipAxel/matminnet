import { Button, Chip } from "@nextui-org/react";
import router from "next/router";
import { api } from "~/utils/api";
import BackButton from "../shared/back-button";
import SkeletonRecipe from "../skeleton/recipe-skeleton";
import DirectionSection from "./DirectionSection";
import IngredientSection from "./IngredientSection";
import LikeButton from "./LikeButton";
import RecipeImage from "./RecipeImage";
import Video from "./Video";
import ShareButton from "./ShareButton";

interface RecipeSectionProps {
  id: string;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({ id }) => {
  const { data, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  const { data: userLikedRecipe } = api.recipe.getUserRecipeLike.useQuery({
    id,
  });

  const { data: likeResponse } = api.recipe.getLikes.useQuery({
    id,
  });

  if (!data?.recipe && !isLoading) {
    void router.push("/404");
  }
  if (isLoading) {
    return <SkeletonRecipe />;
  }

  return (
    <>
      <div className="mb-10 max-w-5xl">
        <BackButton />
        <h1 className="mt-5 px-8  text-left text-[30px] font-bold text-[#3A3A3A]">
          {data?.recipe.name}
        </h1>
        <div className="mb-5 flex  items-baseline gap-3 px-8">
          <LikeButton
            recipeId={id}
            likes={likeResponse?.likes}
            userLikedRecipe={userLikedRecipe?.userLikesRecipe}
          />

          <ShareButton />
        </div>

        <RecipeImage images={data?.recipe.images} />

        <div className="mx-3 my-4 flex justify-center gap-2">
          {data?.recipe.tags.map((tag, index) => (
            <Chip
              className="cursor-pointer bg-[#b195d2] p-2 font-semibold text-white"
              key={index}
              size="md"
            >
              {tag.tag.name}
            </Chip>
          ))}
        </div>

        <div className="mt-5 flex flex-row items-center justify-between">
          {data?.recipe.ingredientsSection ? (
            <h2 className="ml-4 text-[25px]">Ingredients</h2>
          ) : null}

          {data?.recipe.servingSize && (
            <h3 className="mr-4 text-[20px]">
              Serving size: {data?.recipe?.servingSize}
            </h3>
          )}
        </div>

        <div className="ml-4 mt-5 flex flex-col gap-2 sm:ml-10">
          {data?.recipe.ingredientsSection.map((ingredientStep) => {
            return (
              <IngredientSection
                key={ingredientStep.id}
                ingredientStep={ingredientStep}
              />
            );
          })}
        </div>
        {data?.recipe.directions.length ? (
          <div className="flex w-full flex-col items-center justify-center gap-3 px-2 pb-5">
            <h2 className="mb-2 mt-5 text-[25px] font-bold">Directions</h2>
            {data?.recipe.directions.map((direction) => {
              return (
                <DirectionSection key={direction.id} direction={direction} />
              );
            })}
          </div>
        ) : null}

        {data?.recipe.video && <Video video={data?.recipe.video} />}
      </div>
    </>
  );
};

export default RecipeSection;
