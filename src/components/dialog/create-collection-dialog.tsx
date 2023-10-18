/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-no-undef */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Spacer,
  ModalContent,
} from "@nextui-org/react";
import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";
import Image from "next/image";
import { uploadFileToS3 } from "../utils/s3";

interface IFormInput {
  name: string;
  type: string;
}

interface CreateCollectionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const utils = api.useContext();
  const closeHandler = () => {
    setImagePreviewUrl(null);
    setIsOpen(false);
    reset();
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      image: null,
      type: "",
    },
  });

  const createPresignedUrlMutation =
    api.collection.createPresignedUrl.useMutation();

  const { mutate: createCollection } =
    api.collection.createCollection.useMutation({
      onSuccess: async (data, _variables, _context) => {
        if (data.status === "success" && file) {
          const presignedUrlResponse =
            await createPresignedUrlMutation.mutateAsync({
              id: data.response.collection.id,
            });

          await uploadFileToS3({
            getPresignedUrl: () => Promise.resolve(presignedUrlResponse), // Pass the response here
            file,
          });
          await utils.collection.getCollections.invalidate();

          reset();
        }
      },
    });

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) => {
    setIsOpen(false);
    setImagePreviewUrl(null);
    createCollection(FormdData);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);

    // Create a preview URL for the selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreviewUrl(null);
    }
  };

  return (
    <Modal
      closeButton
      aria-labelledby="create-collection"
      isOpen={isOpen}
      onClose={closeHandler}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h1 id="create-collection">Create Collection</h1>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
                maxLength: 50,
                minLength: 2,
              }}
              render={({ field }) => (
                <Input
                  isClearable
                  radius="sm"
                  variant="faded"
                  errorMessage={
                    errors?.name?.type === "required"
                      ? "Input is required"
                      : "" || errors?.name?.type === "maxLength"
                      ? "name must not exceed 50 characters"
                      : ""
                  }
                  color={errors.name?.type === "invalid" ? "danger" : "default"}
                  aria-label={field.name}
                  fullWidth
                  placeholder={field.name}
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1.5} />

            <label
              htmlFor="fileInput"
              className="font-semibol mb-2 block text-black"
            >
              Upload an image to be displayed:
            </label>

            <input
              id="fileInput"
              aria-label={file?.name ?? ""}
              onChange={handleFileChange}
              className="focus:shadow-te-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 duration-300 ease-in-out transition file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:duration-150 file:ease-in-out file:transition file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              accept="image/*"
              type="file"
            />

            <Spacer y={1.5} />
            {imagePreviewUrl?.length && (
              <div className="mt-2">
                Selected Image preview:
                <Image
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  style={{ maxWidth: "100%", maxHeight: "80px" }}
                  width={80}
                  height={80}
                />
              </div>
            )}
            <Spacer y={1.5} />
            <div className="grap-4 mb-2 mt-5 flex justify-end gap-5">
              <div>
                <Button
                  type="button"
                  onPress={() => reset()}
                  variant="solid"
                  color="primary"
                >
                  Clear
                </Button>
              </div>

              <div>
                <Button type="submit" variant="solid" color="primary">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCollectionDialog;
