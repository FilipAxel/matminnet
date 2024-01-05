import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react"; // Replace with appropriate imports
import { MdAccessTime } from "react-icons/md";
import { PiBowlFoodDuotone } from "react-icons/pi";

const SkeletonRecipeCard = () => {
  return (
    <div className="grid w-full bg-transparent xs:w-auto">
      <Card
        isPressable
        className="h-[260px] w-full bg-transparent xs:h-[200px] xs:w-[175px] media428:w-[185px] sm:h-[210] sm:w-[210px]"
      >
        <CardBody className="p-0">
          <div className="h-full w-full animate-pulse bg-gray-400"></div>
        </CardBody>
        <CardFooter className="flex h-full  flex-col-reverse items-start bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="z-30 w-full">
            <div className="mb-2 h-6 w-[80%] animate-pulse rounded bg-gray-300 font-semibold text-white"></div>
            <div className="mt-1 flex items-center space-x-3">
              <div className="flex items-center">
                <MdAccessTime className="mr-1 animate-pulse text-[#d1d1d1]" />
                <div className="h-4 w-8 animate-pulse rounded bg-gray-300 text-white"></div>
              </div>
              <div className="flex items-center">
                <PiBowlFoodDuotone className="mr-1 animate-pulse text-[#d1d1d1]" />
                <div className="h-4 w-8 animate-pulse rounded bg-gray-300 text-white"></div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SkeletonRecipeCard;
