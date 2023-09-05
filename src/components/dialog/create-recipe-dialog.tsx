/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  Input,
  Modal,
  Spacer,
  Switch,
  Textarea,
  ModalHeader,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";
import { useState } from "react";
import { uploadFileToS3 } from "../utils/s3";
import {
  type FormValues,
  type ImageFile,
} from "../create-recipe-from/from-interface";
import IngredientsControler from "../create-recipe-from/ingredients-controller";
import ImageController from "../create-recipe-from/image-controller";
import CollectionController from "../create-recipe-from/collection-controller";
import QuillEditor from "../quill/quill-editor";
import TagsController from "../create-recipe-from/tags.controller";

interface createRecipeDialogProps {
  collectionName?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRecipeDialog: React.FC<createRecipeDialogProps> = ({
  collectionName,
  isOpen,
  setIsOpen,
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [quillContent, setQuillContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const utils = api.useContext();

  const closeHandler = () => {
    setIsOpen(false);
    setImageFiles([]);
    reset();
  };

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      directions: "",
      servingSize: "",
      cookingTime: null,
      tags: [],
      video: "",
      country: "",
      author: "",
      collections: collectionName
        ? [{ value: collectionName, label: collectionName }]
        : [],
      ingredients: [],
      publicationStatus: false,
    },
  });

  const {
    mutate: createRecipe,
    isLoading: loadingCreateddRecipe,
    isSuccess,
  } = api.recipe.createRecipe.useMutation({
    onSuccess: async (data, _variables, _context) => {
      if (data.status === "success" && imageFiles.length > 0) {
        await Promise.all(
          imageFiles.map(async ({ file }) => {
            const presignedUrlResponse =
              await createPresignedUrlMutation.mutateAsync({
                id: data.createdRecipe.id,
              });
            await uploadFileToS3({
              getPresignedUrl: () => Promise.resolve(presignedUrlResponse), // Pass the response here
              file,
            });
            void utils.recipe.getAllRecipesForUser.invalidate();
            closeHandler();
          })
        );

        reset(); // Reset the form after successful submission
      } else if (data.status === "success") {
        closeHandler();
      }
    },
  });

  const createPresignedUrlMutation =
    api.recipe.createPresignedUrl.useMutation();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (uploadError?.length) return;
    formData.cookingTime = Number(formData.cookingTime);
    formData.directions = quillContent;
    createRecipe({
      recipe: formData,
    });
  };

  return (
    <Modal
      closeButton
      aria-labelledby="Create Recipe"
      size="full"
      isOpen={isOpen}
      onClose={closeHandler}
      scrollBehavior="inside"
    >
      <ModalContent className="h-full w-full">
        <ModalHeader className="justify-center">
          <h1 className="text-center font-bold text-[30xpx]" id="create recipe">
            Create Recipe
          </h1>
        </ModalHeader>
        <ModalBody className="mx-2 mb-3">
          <form
            className="m-auto max-w-[800px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
                maxLength: 40,
                minLength: 3,
              }}
              render={({ field }) => (
                <Input
                  size="lg"
                  isClearable
                  radius="sm"
                  variant="faded"
                  isRequired
                  errorMessage={
                    errors?.name?.type === "required"
                      ? "Name is required"
                      : "" || errors?.name?.type === "maxLength"
                      ? "name must not exceed 40 characters"
                      : ""
                  }
                  color={
                    errors.name?.type === "required" ? "danger" : "default"
                  }
                  aria-label={field.name}
                  label="Name"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Spacer y={5} />

            <ImageController
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              uploadError={uploadError}
              setUploadError={setUploadError}
            />

            <Spacer y={5} />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Description"
                  variant="faded"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                  minRows={2}
                  maxRows={8}
                />
              )}
            />
            <Spacer y={5} />
            <label className="mb-2" htmlFor="ingredients">
              Ingredients
            </label>
            <Spacer y={0.5} />
            <Controller
              name="ingredients"
              render={({ field }) => {
                const currentValue = getValues("ingredients") || [];
                return (
                  <IngredientsControler
                    field={field}
                    currentValue={currentValue}
                  />
                );
              }}
              control={control}
            />
            <Spacer y={5} />
            <label htmlFor="directions">Directions</label>
            <Spacer y={0.5} />
            <div id="directions">
              <QuillEditor
                quillContent={quillContent}
                setQuillContent={setQuillContent}
              />
            </div>

            <Spacer y={14} />

            <label className="mb-2" htmlFor="tags">
              Tags
            </label>
            <Spacer y={0.5} />
            <Controller
              name="tags"
              render={({ field }) => {
                const currentValue = getValues("tags") || [];
                return (
                  <TagsController field={field} currentValue={currentValue} />
                );
              }}
              control={control}
            />
            <Spacer y={5} />
            <Controller
              name="servingSize"
              control={control}
              render={({ field }) => (
                <Input
                  radius="sm"
                  variant="faded"
                  aria-label={field.name}
                  fullWidth
                  label="Serving Size"
                  type="text"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={10} />
            <Controller
              name="cookingTime"
              control={control}
              render={({ field }) => (
                <Input
                  radius="sm"
                  variant="faded"
                  isClearable
                  aria-label={field.name}
                  fullWidth
                  labelPlacement="outside"
                  label="Cooking Time"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">Min</span>
                    </div>
                  }
                  type="number"
                  /* value={field.value !== null ? field.value : null} */
                  onChange={(e) => {
                    // Handle both numeric and string inputs
                    const newValue = e.target.value;
                    field.onChange(newValue !== "" ? Number(newValue) : null);
                  }}
                  onBlur={field.onBlur}
                  size="lg"
                />
              )}
            />
            <Spacer y={5} />
            <Controller
              name="video"
              control={control}
              render={({ field }) => (
                <Input
                  isClearable
                  radius="sm"
                  variant="faded"
                  aria-label={field.name + "url"}
                  label="Youtube Link"
                  placeholder="https://www.youtube.com"
                  fullWidth
                  type="url"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={5} />
            <label htmlFor="collections">Collections</label>
            <Spacer y={0.5} />
            <Controller
              name="collections"
              render={({ field }) => {
                const currentValue = getValues("collections") || [];
                return (
                  <CollectionController
                    field={field}
                    currentValue={currentValue}
                  />
                );
              }}
              control={control}
            />

            <Spacer y={5} />
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  isClearable
                  radius="sm"
                  variant="faded"
                  label="Country"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={5} />
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Input
                  isClearable
                  radius="sm"
                  variant="faded"
                  label="Author"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={5} />

            <div className="flex items-center">
              <Controller
                name="publicationStatus"
                control={control}
                render={() => (
                  <Switch
                    isSelected={getValues("publicationStatus") || false}
                    aria-label="Share with Community"
                    color="success"
                    onValueChange={(value) => {
                      setValue("publicationStatus", value);
                      setIsPublished(value);
                    }}
                  />
                )}
              />
              <label className="ml-2" htmlFor="publicationStatus">
                Share with Community
              </label>
            </div>

            {isPublished && (
              <p className="mt-5 max-w-[60ch] text-[#858585]">
                By choosing to publish your recipe, you&apos;re sending it to
                our administrators for review. After approval, your recipe will
                be featured on the discovery page, making it accessible to
                everyone.
              </p>
            )}

            <Spacer y={1} />
            <div className="container mb-4 grid justify-end gap-2">
              {/*  <div className="grid">
                      <Button
                        type="button"
                        onPress={() => reset()}
                        color="primary"
                      >
                        Clear
                      </Button>
                    </div> */}

              <div className="grid">
                <Button
                  isLoading={loadingCreateddRecipe && !isSuccess}
                  type="submit"
                  color="primary"
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
          <Spacer y={2.5} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRecipeDialog;
