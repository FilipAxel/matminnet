import { Card, Image, CardFooter } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useRouter } from "next/router";
import { MdAccessTime } from "react-icons/md";
import { PiBowlFoodDuotone } from "react-icons/pi";

type RecipeWithImage = Recipe & {
  images: { name: string }[];
};
interface MinimalInfoRecipe {
  cookingTimeMinutes: number | null;
  cookingTimeHours: number | null;
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
        className="h-[260px] w-full bg-transparent xs:h-[200px] xs:w-[180px] sm:h-[210] sm:w-[210px]"
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
                {recipe?.cookingTimeMinutes || recipe?.cookingTimeHours ? (
                  <div className="mr-2 flex items-center">
                    <MdAccessTime className="mr-[2px] text-[#d1d1d1]  md:mr-1" />
                    {recipe?.cookingTimeHours && (
                      <h3 className="text-[9px] text-white md:text-[11px]">
                        {recipe?.cookingTimeHours}&nbsp;tim&nbsp;
                      </h3>
                    )}

                    {recipe?.cookingTimeMinutes && (
                      <h3 className="text-[9px] text-white md:text-[11px]">
                        {recipe?.cookingTimeMinutes}&nbsp;min
                      </h3>
                    )}
                  </div>
                ) : null}
                {recipe.servingSize && (
                  <div className="flex items-center">
                    <PiBowlFoodDuotone className="mr-[2px] text-[#d1d1d1]  md:mr-1" />
                    <h3 className="text-[9px] text-white md:text-[11px]">
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
