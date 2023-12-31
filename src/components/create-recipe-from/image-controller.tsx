import { useState, type ChangeEvent, useRef } from "react";
import { type ImageFile } from "./from-interface";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { MdDeleteForever } from "react-icons/md";

interface ImageControllerProps {
  imageFiles: ImageFile[];
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  uploadError: string | null;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageController: React.FC<ImageControllerProps> = ({
  imageFiles,
  setImageFiles,
  uploadError,
  setUploadError,
}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newImageFiles: ImageFile[] = [];
    const totalLength = selectedFiles.length + imageFiles.length;
    console.log(totalLength);
    if (totalLength > 3) {
      setUploadError(
        "Du har överskridit det maximala begränsningen på tre bilder."
      );
      return;
    } else {
      setUploadError(null);
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!file) continue;

      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        newImageFiles.push({ file, previewUrl });

        if (newImageFiles.length === selectedFiles.length) {
          setImageFiles((prevImageFiles) => [
            ...prevImageFiles,
            ...newImageFiles,
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const removeImage = (index: number) => {
    console.log(index);
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Klicka för att ladda upp</span>
              {/*    eller dra och släpp */}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPEG, PNG, WebP, SVG (MAX. 2560x1440px)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Vänligen välj upp till max tre bilder.
            </p>
          </div>

          {uploadError && <p className="text-red-500">{uploadError}</p>}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".jpg, .jpeg, .png, .webp, .svg"
            aria-label="Ladda upp bilder"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 pt-5">
        {imageFiles.map(({ previewUrl }, index) => {
          return (
            <div
              onClick={() => {
                onOpen(), setMainImageIndex(index);
              }}
              className="relative cursor-zoom-in border-1"
              key={index}
            >
              <div className="absolute right-1 top-1 z-40">
                <Button
                  onPress={() => removeImage(index)}
                  className="h-6"
                  isIconOnly
                  color="danger"
                  aria-label="Like"
                >
                  <MdDeleteForever />
                </Button>
              </div>
              <Image
                width={0}
                height={0}
                className="h-[130px] max-h-[130px] w-[140px] max-w-[140px] rounded-none"
                src={previewUrl}
                alt={`Bild Förhandsvisning ${index}`}
              />
              <div className="w-full bg-[#201f1f] p-1 text-center">
                <p className="text-center text-sm text-white">
                  Förhandsvisning
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        placement="center"
        scrollBehavior="inside"
        size="2xl"
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
                  imageFiles?.[mainImageIndex]?.previewUrl ??
                  "/recipe-placeholder.webp"
                }
                alt={
                  imageFiles?.[mainImageIndex]?.previewUrl ??
                  "placeholder image"
                }
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ImageController;
