import { type ChangeEvent } from "react";
import { type ImageFile } from "./from-interface";
import { Image } from "@nextui-org/react";

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
      setUploadError("You have exceeded the maximum limit of three images.");
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

  return (
    <div className="w-full">
      <input
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
        {imageFiles.map(({ previewUrl }, index) => (
          <Image
            key={index}
            width={100}
            height={100}
            className="h-[120px] max-h-[120px] max-w-[120px] rounded-none border-1"
            src={previewUrl}
            alt={`Image Preview ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageController;
