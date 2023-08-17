/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-no-undef */
import { Button, Grid, Input, Modal, Spacer, Text } from "@nextui-org/react";
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
          await uploadFileToS3({
            getPresignedUrl: () =>
              createPresignedUrlMutation.mutateAsync({
                id: data.response.collection.id,
              }),
            file,
          });
          void utils.collection.getCollections.invalidate();

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
    <div>
      <Modal
        closeButton
        aria-labelledby="create-collection"
        open={isOpen}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="create-collection">Create Collection</Text>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
                maxLength: 20,
                minLength: 3,
              }}
              render={({ field }) => (
                <Input
                  clearable
                  bordered
                  helperText={
                    errors?.name?.type === "required"
                      ? "Input is required"
                      : "" || errors?.name?.type === "maxLength"
                      ? "name must not exceed 100 characters"
                      : ""
                  }
                  helperColor={
                    errors.name?.type === "required"
                      ? "error"
                      : "primary" || errors?.name?.type === "maxLength"
                      ? "error"
                      : "primary"
                  }
                  color={errors.name?.type === "required" ? "error" : "primary"}
                  aria-label={field.name}
                  fullWidth
                  placeholder={field.name}
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1.6} />

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
              className="focus:border-primary focus:shadow-te-primary dark:focus:border-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
              accept="image/*"
              type="file"
            />

            <Spacer y={1.6} />
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
            <Spacer y={1.6} />
            <Grid.Container gap={2} justify="flex-end">
              <Grid>
                <Button
                  type="button"
                  onPress={() => reset()}
                  auto
                  flat
                  color="primary"
                >
                  Clear
                </Button>
              </Grid>

              <Grid>
                <Button type="submit" auto flat color="primary">
                  Create
                </Button>
              </Grid>
            </Grid.Container>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateCollectionDialog;
