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
        className="h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[170px] sm:w-[210px]"
      >
        <Image
          removeWrapper
          alt="recipe"
          width={100}
          height={100}
          className="z-0 h-full w-full object-cover"
          src={imageUrl}
        />
        <CardFooter className="absolute top-0 h-full flex-col items-start justify-end bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="z-30 w-full">
            <h2 className="mb-2 text-left text-[18px] font-semibold text-white">
              {recipe.name}
            </h2>
            <div>
              <div className="flex justify-start">
                <div className="flex items-center">
                  <MdAccessTime className="mr-1 text-[#d1d1d1]" />
                  <h3 className="mr-3 text-[11px] text-white">
                    {recipe.cookingTime} min
                  </h3>
                </div>

                <div className="flex items-center">
                  <PiBowlFoodDuotone className="mr-1 text-[#d1d1d1]" />
                  <h3 className="text-[11px] text-white">
                    {recipe.servingSize} Portioner
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default RecipeCard;
