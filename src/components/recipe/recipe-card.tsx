import { Card, Image, CardFooter } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useRouter } from "next/router";
import { MdAccessTime } from "react-icons/md";
import { PiBowlFoodDuotone } from "react-icons/pi";

type RecipeWithImage = Recipe & {
  images: { name: string }[];
};
interface MinimalInfoRecipe {
  cookingTime: number | null;
  id: string;
  images: { name: string }[]; // Corrected type
  name: string;
  publicationStatus: string;
  servingSize: string | null;
}

interface RecipeCardProps {
  recipe: RecipeWithImage | MinimalInfoRecipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const router = useRouter();
  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";

  const handleRoute = () => {
    void router.push(`/recipe/${recipe?.id}`);
  };

  return (
    <>
      <Card
        isPressable
        isHoverable
        onClick={() => handleRoute()}
        className="h-[260px] w-full bg-transparent xs:h-[200px] xs:w-[175px] sm:h-[210] sm:w-[210px]"
      >
        <Image
          removeWrapper
          alt="recipe"
          width={100}
          height={100}
          className="z-0 h-full w-full object-cover"
          src={imageUrl}
        />
        <CardFooter className="absolute top-0 h-full flex-col items-start justify-end bg-gradient-to-t from-[#0b0b0b] via-5% to-85%">
          <div className="z-30 w-full">
            <h2 className="mb-2 text-left text-[16px] font-semibold text-white sm:text-[18px]">
              {recipe.name}
            </h2>
            <div>
              <div className="flex justify-start">
                {recipe.cookingTime && (
                  <div className="flex items-center">
                    <MdAccessTime className="mr-1 text-[#d1d1d1]" />
                    <h3 className="mr-3 text-[11px] text-white">
                      {recipe.cookingTime} min
                    </h3>
                  </div>
                )}
                {recipe.servingSize && (
                  <div className="flex items-center">
                    <PiBowlFoodDuotone className="mr-1 text-[#d1d1d1]" />
                    <h3 className="text-[11px] text-white">
                      {recipe.servingSize} Portioner
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default RecipeCard;
