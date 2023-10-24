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
      <div className="flex w-full justify-center">
        <Image
          className="h-[380px] max-h-[400px] w-full max-w-[400px] justify-center rounded-[15px] object-cover md:h-full md:w-full"
          src={images?.[mainImageIndex]?.name ?? "/recipe-placeholder.webp"}
          width={0}
          height={0}
          alt={images?.[mainImageIndex]?.name ?? "placeholder image"}
        />
      </div>

      {images?.length && images.length > 1 && (
        <div className="flex justify-center gap-2">
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
      )}
    </>
  );
};

export default RecipeImage;