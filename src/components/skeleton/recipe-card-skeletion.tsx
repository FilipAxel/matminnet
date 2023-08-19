import React from "react";
import { Card, Grid } from "@nextui-org/react"; // Replace with appropriate imports
import { MdAccessTime } from "react-icons/md";
import { PiBowlFoodDuotone } from "react-icons/pi";

const SkeletonRecipeCard = () => {
  return (
    <Grid className="w-full bg-transparent xs:w-auto">
      <Card
        isPressable
        className="sm:w-[210px] h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px]"
      >
        <Card.Body css={{ p: 0 }}>
          <div className="h-full w-full animate-pulse bg-gray-400"></div>
        </Card.Body>
        <Card.Footer
          className="flex h-full  flex-col-reverse items-start bg-gradient-to-t from-black via-transparent to-transparent"
          css={{
            position: "absolute",
            bottom: 0,
            top: 0,
            zIndex: 1,
          }}
        >
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
        </Card.Footer>
      </Card>
    </Grid>
  );
};

export default SkeletonRecipeCard;
