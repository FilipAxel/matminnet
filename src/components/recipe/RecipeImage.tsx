import { Image } from "@nextui-org/react";
import { useState } from "react";

interface RecipeImageProps {
  images:
    | {
        name: string;
      }[]
    | undefined;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ images }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  return (
    <>
      <div className="flex w-full flex-col justify-center overflow-hidden">
        <Image
          radius="none"
          className="h-full w-full lg:max-h-[500px] lg:min-w-[600px]"
          src={images?.[mainImageIndex]?.name ?? "/recipe-placeholder.webp"}
          alt={images?.[mainImageIndex]?.name ?? "placeholder image"}
        />

        {images?.length && images.length > 1 ? (
          <div className="mx-auto flex justify-center gap-2">
            {images?.map((image, index: number) => (
              <div
                key={index}
                className={`mt-5 cursor-pointer  rounded-[10px] ${
                  index === mainImageIndex ? "border-2 border-[#b195d2]" : ""
                }`}
              >
                <Image
                  src={image.name}
                  className="m-1 h-[130px] w-[110px]"
                  onClick={() => setMainImageIndex(index)}
                  alt={`Image ${index}`}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default RecipeImage;
