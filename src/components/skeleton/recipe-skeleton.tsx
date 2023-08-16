import React from "react";
import { Card, Grid, Text } from "@nextui-org/react";

const SkeletonRecipe = () => {
  return (
    <div className="mb-10 max-w-5xl">
      <div className="m-auto mt-12 h-[380px] w-[250px] animate-pulse rounded-[15px] bg-gray-300"></div>
      <Grid.Container justify="center" gap={2}>
        <Grid xs={3} className="mt-5 cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </Grid>
        <Grid xs={3} className="mt-5 cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </Grid>
        <Grid xs={3} className="mt-5 cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </Grid>
      </Grid.Container>
      <Text
        h1
        size={30}
        className="m-auto mt-5 w-[80%] animate-pulse bg-gray-300 text-center font-semibold"
      >
        &nbsp;
      </Text>

      <div className="mt-5 flex flex-row items-center justify-between">
        <Text h2 size={25} className="ml-4  font-semibold">
          Ingredients
        </Text>
        <Text className="mr-4" h3 size={20}>
          Serving size:{" "}
          <span className="animate-pulse bg-gray-300 px-4">&nbsp;</span>
        </Text>
      </div>
      <Grid.Container className="mt-4" gap={1} justify="center">
        <Grid xs={11}>
          <Card css={{ mw: "400px" }} variant="flat">
            <Card.Body className="flex animate-pulse flex-row items-center  justify-between">
              <Text
                className="w-[250px] animate-pulse bg-gray-400 py-4"
                b
                h2
              ></Text>
              <Text
                className="animate-pulse bg-gray-400 p-4"
                h3
                size={15}
                small
              ></Text>
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={11}>
          <Card css={{ mw: "400px" }} variant="flat">
            <Card.Body className="flex animate-pulse flex-row items-center  justify-between">
              <Text
                className="w-[250px] animate-pulse bg-gray-400 py-4"
                b
                h2
              ></Text>
              <Text
                className="animate-pulse bg-gray-400 p-4"
                h3
                size={15}
                small
              ></Text>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>

      <Text h2 size={25} className="ml-4 mt-5 font-semibold">
        Directions
      </Text>
      <div className="m-5 animate-pulse bg-gray-300">
        <div className="ml-5 w-[80%] animate-pulse items-center pt-10">
          <Text className="w-full animate-pulse bg-gray-400 py-4" b h2></Text>
        </div>
        <div className="ml-5 mt-5 w-[80%] animate-pulse items-center">
          <Text className="w-full animate-pulse bg-gray-400 py-4" b h2></Text>
        </div>
        <div className="ml-5 mt-5 w-[80%] animate-pulse items-center pb-10">
          <Text className="w-full animate-pulse bg-gray-400 py-4" b h2></Text>
        </div>
      </div>
    </div>
  );
};

export default SkeletonRecipe;
