import { Card, Grid, Row, Text } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import Link from "next/link";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
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
              src={
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
              }
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
