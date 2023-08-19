import { Card, Col, Grid, Row, Text } from "@nextui-org/react";
import { type Collection } from "@prisma/client";
import { useRouter } from "next/router";
import { MdOutlineMenuBook } from "react-icons/md";

type CollectionWithImage = Collection & {
  image: { name: string }[];
  _count: {
    recipes: number;
  };
};
interface CollectionCardProps {
  collection: CollectionWithImage;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const router = useRouter();
  const imageUrl = collection?.image?.[0]?.name ?? "/recipe-placeholder.webp";

  const handleRoute = () => {
    void router.push(`/collection/${collection?.id}`);
  };

  return (
    <Grid className="w-full bg-transparent xs:w-auto">
      <Card
        isPressable
        className="sm:w-[210px] h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px]"
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
                {collection.name}
              </Text>
              <Row>
                <Row>
                  <div className="flex items-center">
                    <MdOutlineMenuBook className="mr-1 text-[#d1d1d1]" />
                    <Text className="mr-3 text-white" size={11}>
                      {collection._count.recipes} Recipes
                    </Text>
                  </div>
                </Row>
              </Row>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Grid>
  );
};

export default CollectionCard;
