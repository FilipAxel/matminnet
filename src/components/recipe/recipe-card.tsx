import { Card, Row, Text, Col, Grid } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useRouter } from "next/router";
import { MdAccessTime } from "react-icons/md";
import { PiBowlFoodDuotone } from "react-icons/pi";

type RecipeWithImage = Recipe & {
  images: { name: string }[];
};
interface RecipeCardProps {
  recipe: RecipeWithImage;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const router = useRouter();
  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";

  const handleRoute = () => {
    void router.push(`/recipe/${recipe?.id}`);
  };

  return (
    <>
      <Grid>
        <Card
          isPressable
          className="h-[240px] w-[160px] sm:h-[260px] sm:w-[200px]"
          onClick={() => handleRoute()}
        >
          <Card.Body css={{ p: 0 }}>
            <Card.Image
              src={imageUrl}
              onError={(event) => {
                const imgElement = event.currentTarget as HTMLImageElement;
                imgElement.src = "/recipe-placeholder.webp";
              }}
              objectFit="cover"
              width="100%"
              height="100%"
              alt="Relaxing app background"
            />
          </Card.Body>
          <Card.Footer
            className="flex h-full flex-col-reverse bg-gradient-to-t from-black via-transparent to-transparent"
            css={{
              position: "absolute",
              bottom: 0,
              top: 0,
              zIndex: 1,
            }}
          >
            <Row>
              <Col className="z-30">
                <Text className="font-semibold text-white" size={20}>
                  {recipe.name}
                </Text>
                <Row>
                  <Row>
                    <div className="flex items-center">
                      <MdAccessTime className="mr-1 text-[#d1d1d1]" />
                      <Text className="mr-3 text-white" size={11}>
                        {recipe.cookingTime}
                      </Text>
                    </div>

                    <div className="flex items-center">
                      <PiBowlFoodDuotone className="mr-1 text-[#d1d1d1]" />
                      <Text className="text-white" size={11}>
                        {recipe.servingSize} Serve
                      </Text>
                    </div>
                  </Row>
                </Row>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    </>
  );
};

export default RecipeCard;
