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

    if (selectedFiles.length + imageFiles.length > 3) {
      setUploadError(
        "Du har överskridit det maximala begränsningen på tre bilder."
      );
      return;
    } else {
      setUploadError(null);
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!file) continue; // Skip if the file is undefined

      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        newImageFiles.push({ file, previewUrl });

        if (newImageFiles.length === selectedFiles.length) {
          setImageFiles(newImageFiles);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /*   const removeImage = (index: number) => {
    console.log(index);
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };
 */
  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        aria-label="Upload images"
        onChange={handleFileChange}
        className="focus:shadow-te-primary hover:file:[#066FEE] relative m-0 block w-full min-w-0 flex-auto rounded border border-solid
         border-neutral-300
          px-3 py-[0.32rem] text-base font-normal
           text-neutral-700 duration-300 ease-in-out
            transition file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 
            file:border-solid file:border-inherit file:bg-[#066FEE] file:px-3 file:py-[0.32rem] file:text-white
             file:duration-150 file:ease-in-out file:transition file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] 
             focus:border-primary focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
        accept="image/*"
        type="file"
        multiple
      />
      {uploadError && <p className="text-red-500">{uploadError}</p>}
      <div className="flex flex-wrap items-center justify-start gap-5 pt-5">
        {imageFiles.map(({ previewUrl }, index) => {
          return (
            <div
              onClick={() => {
                onOpen(), setMainImageIndex(index);
              }}
              className="relative cursor-zoom-in border-1"
              key={index}
            >
              {/*  <div className="absolute right-1 top-1 z-40">
                <Button
                  onPress={() => removeImage(index)}
                  className="h-6"
                  isIconOnly
                  color="danger"
                  aria-label="Like"
                >
                  <MdDeleteForever />
                </Button>
              </div> */}
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
