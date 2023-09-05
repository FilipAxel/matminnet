import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const SkeletonRecipe = () => {
  return (
    <div className="mb-10 max-w-5xl">
      <div className="m-auto mt-12 h-[380px] w-[250px] animate-pulse rounded-[15px] bg-gray-300"></div>
      <div className=" flex justify-center gap-4">
        <div className="mt-5 grid cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </div>
        <div className="mt-5 cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </div>
        <div className="mt-5 cursor-pointer rounded-[10px]">
          <div className="h-[100px] w-[100px] animate-pulse bg-gray-300"></div>
        </div>
      </div>
      <h1 className="font-size[30px] m-auto mt-5 w-[80%] animate-pulse bg-gray-300 text-center font-semibold">
        &nbsp;
      </h1>

      <div className="mt-5 flex flex-row items-center justify-between">
        <h2 className="ml-4 text-[25px]  font-semibold">Ingredients</h2>
        <h3 className="mr-4 text-[20px]">
          Serving size:{" "}
          <span className="animate-pulse bg-gray-300 px-4">&nbsp;</span>
        </h3>
      </div>
      <div className="container mt-4 grid justify-center gap-4">
        <div className="grid">
          <Card className="max-w-[400px]">
            <CardBody className="flex animate-pulse flex-row items-center  justify-between">
              <h2 className="w-[250px] animate-pulse bg-gray-400 py-4 font-bold"></h2>
              <h3 className="animate-pulse bg-gray-400 p-4 text-[15px]"></h3>
            </CardBody>
          </Card>
        </div>
        <div className="grid">
          <Card className="max-w-[400px]">
            <CardBody className="flex animate-pulse flex-row items-center  justify-between">
              <h2 className="w-[250px] animate-pulse bg-gray-400 py-4 font-bold"></h2>
              <h3 className="animate-pulse bg-gray-400 p-4 text-[15px]"></h3>
            </CardBody>
          </Card>
        </div>
        <div className="grid">
          <Card className="max-w-[400px]">
            <CardBody className="flex animate-pulse flex-row items-center  justify-between">
              <h2 className="font-bald w-[250px] animate-pulse bg-gray-400 py-4"></h2>
              <h3 className="animate-pulse bg-gray-400 p-4 font-[15px]"></h3>
            </CardBody>
          </Card>
        </div>
      </div>

      <h2 className="ml-4 mt-5 text-[25px] font-semibold">Directions</h2>
      <div className="m-5 animate-pulse bg-gray-300">
        <div className="ml-5 w-[80%] animate-pulse items-center pt-10">
          <h2 className="w-full animate-pulse bg-gray-400 py-4"></h2>
        </div>
        <div className="ml-5 mt-5 w-[80%] animate-pulse items-center">
          <h2 className="w-full animate-pulse bg-gray-400 py-4"></h2>
        </div>
        <div className="ml-5 mt-5 w-[80%] animate-pulse items-center pb-10">
          <h2 className="w-full animate-pulse bg-gray-400 py-4"></h2>
        </div>
      </div>
    </div>
  );
};

export default SkeletonRecipe;
