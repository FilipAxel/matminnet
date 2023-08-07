import { Card, Grid, Row, Text } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import Link from "next/link";

type RecipeWithImage = Recipe & {
  images: { name: string }[];
};
interface RecipeCardProps {
  recipe: RecipeWithImage;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";
  return (
    <Grid>
      <Card className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]">
        <Card.Body className="group relative" css={{ p: 0 }}>
          <Link
            className="overflow-hidden"
            color="primary"
            href={`/recipe/${recipe?.id}`}
          >
            <Card.Image
              src={imageUrl}
              onError={(event) => {
                const imgElement = event.currentTarget as HTMLImageElement;
                imgElement.src = "/recipe-placeholder.webp";
              }}
              showSkeleton
              objectFit="cover"
              width={"100%"}
              height={130}
              alt={recipe?.name}
            />
          </Link>
        </Card.Body>
        <Card.Footer
          className="bg-slate-800"
          css={{ justifyItems: "flex-start" }}
        >
          <Row wrap="wrap" justify="space-between" align="center">
            <Text
              b
              css={{
                color: "$accents1",
              }}
              className="truncate"
            >
              {recipe?.name}
            </Text>
          </Row>
        </Card.Footer>
      </Card>
    </Grid>
  );
};

export default RecipeCard;
