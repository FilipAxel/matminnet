/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  Grid,
  Input,
  Modal,
  Spacer,
  Switch,
  type SwitchEvent,
  Text,
  Textarea,
} from "@nextui-org/react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";
import { useState, useMemo } from "react";
import { uploadFileToS3 } from "../utils/s3";
import {
  type FormValues,
  type ImageFile,
} from "../create-recipe-from/from-interface";
import IngredientsControler from "../create-recipe-from/ingredients-controller";
import ImageController from "../create-recipe-from/image-controller";
import CollectionController from "../create-recipe-from/collection-controller";
import QuillEditor from "../quill/quill-editor";

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
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      directions: "",
      servingSize: "",
      cookingTime: null,
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

  const { mutate: createRecipe } = api.recipe.createRecipe.useMutation({
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
          })
        );
        reset(); // Reset the form after successful submission
      }
    },
  });

  const createPresignedUrlMutation =
    api.recipe.createPresignedUrl.useMutation();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (uploadError?.length) return;
    formData.cookingTime = Number(formData.cookingTime);
    formData.directions = quillContent;
    setIsOpen(false);
    setImageFiles([]);
    createRecipe({
      recipe: formData,
    });
  };

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="Create Recipe"
        fullScreen
        open={isOpen}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text size={30} weight="bold" h1 id="create recipe">
            Create Recipe
          </Text>
        </Modal.Header>
        <Modal.Body className="mx-2 mb-3">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  size="xl"
                  clearable
                  bordered
                  helperText={
                    errors?.name?.type === "required"
                      ? "Name is required"
                      : "" || errors?.name?.type === "maxLength"
                      ? "name must not exceed 40 characters"
                      : ""
                  }
                  helperColor={
                    errors.name?.type === "required"
                      ? "error"
                      : "primary" || errors?.name?.type === "maxLength"
                      ? "error"
                      : "primary"
                  }
                  color={errors.name?.type === "required" ? "error" : "default"}
                  aria-label={field.name}
                  label="Name"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Spacer y={1} />

            <ImageController
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              uploadError={uploadError}
              setUploadError={setUploadError}
            />

            <Spacer y={1} />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  bordered
                  label="Description"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                  minRows={2}
                  maxRows={8}
                />
              )}
            />
            <Spacer y={1} />
            <label className="mb-2" htmlFor="ingredients">
              Ingredients
            </label>
            <Spacer y={0.2} />
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
            <Spacer y={1} />
            <label htmlFor="directions">Directions</label>
            <Spacer y={0.2} />
            <div id="directions">
              <QuillEditor
                quillContent={quillContent}
                setQuillContent={setQuillContent}
              />
            </div>

            <Spacer y={4} />
            <Controller
              name="servingSize"
              control={control}
              render={({ field }) => (
                <Input
                  bordered
                  aria-label={field.name}
                  fullWidth
                  label="Serving Size"
                  type="text"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />
            <Controller
              name="cookingTime"
              control={control}
              render={({ field }) => (
                <Input
                  bordered
                  aria-label={field.name}
                  fullWidth
                  label="Cooking Time"
                  labelRight="Min"
                  type="number"
                  value={field.value !== null ? field.value : ""}
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
            <Spacer y={1} />
            <Controller
              name="video"
              control={control}
              render={({ field }) => (
                <Input
                  clearable
                  bordered
                  aria-label={field.name + "url"}
                  label="Youtube Link"
                  fullWidth
                  type="url"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />
            <label htmlFor="collections">Collections</label>
            <Spacer y={0.2} />
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

            <Spacer y={1} />
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  clearable
                  bordered
                  label="Country"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Input
                  clearable
                  bordered
                  label="Author"
                  aria-label={field.name}
                  fullWidth
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1.6} />

            <div className="flex items-center">
              <Controller
                name="publicationStatus"
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    shadow
                    color="success"
                    onChange={(e: SwitchEvent) => {
                      field.onChange(e.target.checked);
                      setIsPublished(e.target.checked);
                    }}
                  />
                )}
              />
              <label className="ml-2" htmlFor="publicationStatus">
                Share with Community
              </label>
            </div>

            {isPublished && (
              <Text size="$xs" color="#858585" className="mt-5 max-w-[60ch]">
                By choosing to publish your recipe, you&apos;re sending it to
                our administrators for review. After approval, your recipe will
                be featured on the discovery page, making it accessible to
                everyone.
              </Text>
            )}

            <Spacer y={0.5} />
            <Grid.Container gap={2} justify="flex-end" className="mb-4">
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
          <Spacer y={2.4} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateRecipeDialog;
