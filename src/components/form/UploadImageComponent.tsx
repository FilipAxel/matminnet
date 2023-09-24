import { ScrollShadow, cn } from "@nextui-org/react";
import { useState } from "react";
import { type ImageFile } from "~/components/create-recipe-from/from-interface";
import ImageController from "~/components/create-recipe-from/image-controller";

interface ImageComponentProps {
  imageFiles: ImageFile[]; // Define the prop types
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFile[]>>;
}

const UploadImageComponent: React.FC<ImageComponentProps> = ({
  imageFiles,
  setImageFiles,
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  return (
    <div className="my-10">
      <h1 className="mb-5 w-full text-left text-4xl font-semibold">
        Add Recipe Images
      </h1>

      <ScrollShadow
        hideScrollBar
        onClick={toggleSize}
        size={shadowSize}
        className={cn("mb-8", {
          "h-[65px]": shadowSize === 50,
          "h-[95px]": shadowSize === 0,
        })}
      >
        <p className="mb-5 max-w-[70ch] text-left text-sm text-gray-500">
          Enhance your recipe by adding up to three images. The first selected
          image will serve as the thumbnail for your recipe. Click below to
          upload your images, ensuring your culinary masterpiece is visually
          appealing. Share the essence of your recipe with beautiful visuals.
        </p>
      </ScrollShadow>

      <ImageController
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        uploadError={uploadError}
        setUploadError={setUploadError}
      />
    </div>
  );
};

export default UploadImageComponent;
