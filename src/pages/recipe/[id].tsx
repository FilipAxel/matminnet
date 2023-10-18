import { Card, CardBody, Chip, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import BackButton from "~/components/shered/back-button";
import SkeletonRecipe from "~/components/skeleton/recipe-skeleton";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

const Recipe = () => {
  const router = useRouter();
  const { query } = router;
  const id = query.id as string;
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { data: recipe, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });
  const directions = recipe?.directions || "";
  if (!recipe && !isLoading) {
    void router.push("/404");
  }

  if (isLoading) {
    return <SkeletonRecipe />;
  }
  if (!isLoading) {
    return (
      <div className="mb-10 max-w-5xl">
        <BackButton />

        <div className="flex w-full justify-center">
          <Image
            className="h-[380px] max-h-[400px] w-[300px] max-w-[400px] justify-center rounded-[15px] object-cover md:h-full md:w-full"
            src={
              recipe?.images?.[mainImageIndex]?.name ??
              "/recipe-placeholder.webp"
            }
            width={0}
            height={0}
            alt={recipe?.images?.[mainImageIndex]?.name ?? "placeholder image"}
          />
        </div>

        {recipe?.images?.length && recipe.images.length > 1 && (
          <div className="flex justify-center gap-2">
            {recipe?.images?.map((image, index) => (
              <div
                key={index}
                className={`mt-5 cursor-pointer  rounded-[10px] ${
                  index === mainImageIndex ? "border-2 border-[#b195d2]" : ""
                }`}
              >
                <Image
                  src={image.name}
                  className="m-1 h-[100px] w-[100px]"
                  onClick={() => setMainImageIndex(index)}
                  alt={`Image ${index}`}
                />
              </div>
            ))}
          </div>
        )}

        <h1 className="mt-5 text-center text-[30px] font-bold">
          {recipe?.name}
        </h1>

        <div className="mx-3 my-4 flex justify-center">
          {recipe?.tags.map((tag, index) => (
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
          <h2 className="ml-4 text-[25px]">Ingredients</h2>

          {recipe?.servingSize && (
            <h3 className="mr-4 text-[20px]">
              Serving size: {recipe?.servingSize}
            </h3>
          )}
        </div>
        <div className="ml-4 mt-4 flex flex-col gap-2 sm:ml-10">
          {recipe?.recipeIngredients?.map((recipeIngredient) => {
            return (
              <div className="grid" key={recipeIngredient.id}>
                <Card className="w-full max-w-[400px]">
                  <CardBody className="flex flex-row items-center justify-between">
                    <h2 className="font-bold">
                      {recipeIngredient.ingredient.name}
                    </h2>
                    <h3 className="text-[15px]">
                      {recipeIngredient?.quantity}&nbsp;
                      {recipeIngredient?.unit}
                    </h3>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>

        <h2 className="ml-4 mt-5 text-[25px] font-bold">Directions</h2>

        <DynamicReactQuill
          className="mx-5 mb-[60px] mt-5 max-w-[350px]"
          value={directions}
          readOnly={true}
          theme={"bubble"}
        />

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
