import { Card, Grid, Link, Row, Text } from "@nextui-org/react";
import { type Catalog } from "@prisma/client";

type CatalogWithImage = Catalog & {
  image: { name: string }[];
};
interface CatalogCardProps {
  catalog: CatalogWithImage;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalog }) => {
  const imageUrl = catalog?.image?.[0]?.name ?? "/recipe-placeholder.webp";
  return (
    <Grid>
      <Card className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]">
        <Card.Body className="group relative" css={{ p: 0 }}>
          <Link
            className="overflow-hidden"
            color="primary"
            href={`/catalog/${catalog?.id}`}
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
              alt={catalog?.name}
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
              {catalog?.name}
            </Text>
          </Row>
        </Card.Footer>
      </Card>
    </Grid>
  );
};

export default CatalogCard;
