import { Image, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { MdOutlineZoomOutMap } from "react-icons/md";
interface RecipeImageProps {
  images:
    | {
        name: string;
      }[]
    | undefined;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ images }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mainImageIndex, setMainImageIndex] = useState(0);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="absolute bottom-2 right-2 z-50">
            <MdOutlineZoomOutMap
              onClick={onOpen}
              className="cursor-pointer text-2xl text-white"
            />
          </div>
          <Image
            className="h-[390px] w-full rounded-none bg-black object-cover sm:h-[400px] sm:w-[700px] sm:rounded-md"
            src={images?.[mainImageIndex]?.name ?? "/recipe-placeholder.webp"}
            alt={images?.[mainImageIndex]?.name ?? "placeholder image"}
          />
        </div>

        <Modal
          placement="center"
          size="2xl"
          scrollBehavior="inside"
          backdrop="blur"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          radius="none"
        >
          <ModalContent>
            {() => (
              <div className="flex justify-center bg-black">
                <Image
                  className="h-full w-full rounded-none object-contain"
                  src={
                    images?.[mainImageIndex]?.name ?? "/recipe-placeholder.webp"
                  }
                  alt={images?.[mainImageIndex]?.name ?? "placeholder image"}
                />
              </div>
            )}
          </ModalContent>
        </Modal>

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
                  className="m-1 h-[120px] w-[120px]"
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
