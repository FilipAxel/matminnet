import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";

const content = [
  {
    title: "Reading your recipe... hopefully we like it...",
    subTitle: "",
    src: "/reading.svg",
  },
  {
    title: "Sourcing your ingredients...",
    subTitle: "",
    src: "/happy.svg",
  },
  {
    title: "Voilà! Your recipe is ready to be savored...",
    subTitle: "Rerouting you to recipes... wait...",
    src: "/winners.svg",
  },
];

const CreateRecipeLoader: React.FC = () => {
  const { width, height } = useWindowSize();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImageIndex === content.length - 1) {
        // If we are at the last content item, do not increment the index
        clearInterval(interval);
      } else {
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);
  return (
    <>
      {content[currentImageIndex]?.src === "/winners.svg" && (
        <Confetti numberOfPieces={150} width={width} height={height} />
      )}
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <div className="flex h-[250px] w-[250px]">
          <Image
            width={250}
            height={250}
            className="flex h-full w-full"
            src={content[currentImageIndex]?.src}
            alt={content[currentImageIndex]?.title}
          />
        </div>
        <div className="pt-10 text-center">
          <h1 className="text-2xl font-semibold">
            {content[currentImageIndex]?.title}
          </h1>
          <p> {content[currentImageIndex]?.subTitle}</p>
        </div>
      </div>
    </>
  );
};

export default CreateRecipeLoader;
