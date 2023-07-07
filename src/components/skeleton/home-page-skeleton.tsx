import { Grid, Card, Row, Text } from "@nextui-org/react";

import { FaPlus } from "react-icons/fa6";
import { MdPerson2 } from "react-icons/md";

const HomePageSkeleton = () => {
  const catalogs = [
    {
      id: 1,
      name: "Pasta",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
    },
    {
      id: 2,
      name: "BBQ",
      image:
        "https://images.unsplash.com/photo-1534797258760-1bd2cc95a5bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    },
    {
      id: 3,
      name: "Antipasto",
      image:
        "https://images.unsplash.com/photo-1574183118053-258a7b31e784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1792&q=80",
    },
    {
      id: 4,
      name: "Swedish home cooking",
      image:
        "https://images.unsplash.com/photo-1515516969-d4008cc6241a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 5,
      name: "Seafood",
      image:
        "https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 6,
      name: "Spritz drinks",
      image:
        "https://images.unsplash.com/photo-1586124288291-936b6673884a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 7,
      name: "Teppanyaki",
      image:
        "https://images.unsplash.com/photo-1591114320268-fb3aac361d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80",
    },
    {
      id: 8,
      name: "Sandwich",
      image:
        "https://images.unsplash.com/photo-1619860860774-1e2e17343432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 9,
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    },
    {
      id: 10,
      name: "Korean",
      image:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 11,
      name: "Indian",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80",
    },
    {
      id: 12,
      name: "Japanese",
      image:
        "https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 13,
      name: "Italian",
      image:
        "https://images.unsplash.com/photo-1555072930-714bba1d24e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      id: 14,
      name: "Sallad",
      image:
        "https://images.unsplash.com/photo-1633352184849-1c28c22d7757?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    },
    {
      id: 15,
      name: "Deserts",
      image:
        "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
  ];
  return (
    <>
      <Grid className="mr-4 mt-4 flex items-center justify-end">
        <Text className="mr-2">Welcome</Text>

        <MdPerson2 className="text-2xl" />
      </Grid>
      <Grid.Container className="flex justify-center" gap={2}>
        <Grid>
          <Card variant="bordered" css={{ width: "180px", height: "180px" }}>
            <Card.Body className="flex items-center justify-center">
              <Text className="text-center text-2xl text-gray-800">
                Create Catalog
              </Text>

              <FaPlus className="mt-5 text-xl text-gray-800" />
            </Card.Body>
          </Card>
        </Grid>
        {catalogs?.map((catalog) => {
          return (
            <Grid key={catalog.id}>
              <Card css={{ width: "180px", height: "180px" }}>
                <Card.Body className="group relative" css={{ p: 0 }}>
                  <div color="primary">
                    <Card.Image
                      src={catalog.image}
                      showSkeleton
                      objectFit="cover"
                      width={"100%"}
                      height={130}
                      alt={catalog.name}
                    />
                  </div>
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
        })}
      </Grid.Container>
    </>
  );
};

export default HomePageSkeleton;
