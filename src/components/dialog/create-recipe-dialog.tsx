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
import Select, { type ActionMeta } from "react-select";
import { api } from "~/utils/api";
import CreatableSelect from "react-select/creatable";
import { type ChangeEvent, Fragment, useState } from "react";
import { uploadFileToS3 } from "../utils/s3";
import Image from "next/image";

interface CollectionOption {
  value: string;
  label: string;
}

interface IngredientOption {
  value: string;
  label: string;
  quantity: string;
  unit: string;
}

interface FormValues {
  name: string;
  description: string;
  direction: string;
  ingredients: IngredientOption[];
  servingSize: string;
  cookingTime: number;
  video: string;
  country: string;
  author: string;
  collections: CollectionOption[];
  publicationStatus: boolean;
}

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
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const closeHandler = () => {
    setIsOpen(false);
    setImagePreviewUrl(null);
    reset();
  };

  const { data: ingredients } = api.ingredient.getAllIngredients.useQuery();
  const ingredientOptions: IngredientOption[] =
    ingredients?.map((ingredient: { name: string }) => ({
      value: ingredient.name,
      label: ingredient.name,
      quantity: "1",
      unit: "st",
    })) ?? [];

  const { data: collections } = api.collection.getCollections.useQuery();
  const collectionOptions: CollectionOption[] =
    collections?.map((collection: { id: string; name: string }) => ({
      value: collection.id,
      label: collection.name,
    })) ?? [];

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
      direction: "",
      servingSize: "",
      cookingTime: 0,
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
      if (data.status === "success" && file) {
        await uploadFileToS3({
          getPresignedUrl: () =>
            createPresignedUrlMutation.mutateAsync({
              id: data.createdRecipe.id,
            }),
          file,
        });
        reset(); // Reset the form after successful submission
      }
    },
  });

  const createPresignedUrlMutation =
    api.recipe.createPresignedUrl.useMutation();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    formData.cookingTime = Number(formData.cookingTime);
    setIsOpen(false);
    setImagePreviewUrl(null);
    createRecipe({
      recipe: formData,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);

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
        aria-labelledby="create recipe"
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
                maxLength: 20,
                minLength: 3,
              }}
              render={({ field }) => (
                <Input
                  clearable
                  bordered
                  helperText={
                    errors?.name?.type === "required"
                      ? "Name is required"
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
                  color={errors.name?.type === "required" ? "error" : "default"}
                  aria-label={field.name}
                  label="Name"
                  fullWidth
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />

            <label
              htmlFor="fileInput"
              className="font-semibol mb-2 block text-black"
            >
              Upload an image to be displayed:
            </label>

            <input
              aria-label={file?.name ?? ""}
              onChange={handleFileChange}
              className="focus:border-primary focus:shadow-te-primary dark:focus:border-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
              accept="image/*"
              type="file"
            />

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
                  minRows={1}
                  maxRows={8}
                />
              )}
            />
            <Spacer y={1} />
            <label htmlFor="ingredients">Ingredients</label>
            <Controller
              name="ingredients"
              render={({ field }) => {
                const { onChange } = field;
                const currentValue = getValues("ingredients") || [];

                const handleInputChange = (
                  newValue: IngredientOption[],
                  actionMeta: ActionMeta<IngredientOption>
                ) => {
                  if (actionMeta.action === "create-option") {
                    const { label, value } = actionMeta.option;
                    const existingOptionIndex = currentValue.findIndex(
                      (option) => option.label === label
                    );
                    if (existingOptionIndex !== -1) {
                      currentValue.splice(existingOptionIndex, 1);
                    }
                    const newIngredient: IngredientOption = {
                      value: value,
                      label: label,
                      quantity: "1",
                      unit: "st",
                    };
                    const updatedValue = [...currentValue, newIngredient];
                    onChange(updatedValue);
                  } else {
                    onChange(newValue);
                  }
                };

                const handleIngredientChange = (
                  index: number,
                  field: string,
                  value: string
                ) => {
                  const updatedIngredients = [...currentValue];
                  if (updatedIngredients[index]) {
                    updatedIngredients[index] = {
                      ...updatedIngredients[index],
                      [field]: value,
                    } as IngredientOption;
                    onChange(updatedIngredients);
                  }
                };

                return (
                  <>
                    <CreatableSelect
                      {...field}
                      isMulti
                      options={ingredientOptions}
                      isClearable={true}
                      onChange={handleInputChange}
                    />
                    {currentValue.length > 0 && (
                      <Grid.Container gap={1} justify="center">
                        {currentValue.map((option, index) => (
                          <Fragment key={option.value}>
                            <Grid xs={4}>
                              <Input
                                aria-labelledby={option.label}
                                size="sm"
                                value={option.label}
                                type="text"
                                onChange={(e) =>
                                  handleIngredientChange(
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid xs={4}>
                              <Input
                                aria-labelledby={"quantity"}
                                size="sm"
                                value={option.quantity}
                                type="number"
                                onChange={(e) =>
                                  handleIngredientChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid xs={4}>
                              <Input
                                aria-labelledby={option.unit}
                                size="sm"
                                value={option.unit}
                                type="text"
                                onChange={(e) =>
                                  handleIngredientChange(
                                    index,
                                    "unit",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                          </Fragment>
                        ))}
                      </Grid.Container>
                    )}
                  </>
                );
              }}
              control={control}
            />
            <Spacer y={1} />
            <Controller
              name="direction"
              control={control}
              render={({ field }) => (
                <Textarea
                  bordered
                  label="Direction"
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
            <Controller
              name="servingSize"
              control={control}
              render={({ field }) => (
                <Input
                  bordered
                  aria-label={field.name}
                  fullWidth
                  label="Serving size"
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
                  label="cooking Time (in minutes)"
                  labelRight="Min"
                  type="number"
                  {...field}
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
                  label="Youtube link"
                  fullWidth
                  type="url"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />
            <label htmlFor="collections">Collections</label>
            <Controller
              name="collections"
              render={({ field }) => {
                const { onChange } = field;
                const currentValue = getValues("collections") || [];

                const handleInputChange = (
                  newValue: CollectionOption[],
                  actionMeta: ActionMeta<CollectionOption>
                ) => {
                  if (actionMeta.action === "create-option") {
                    const { label, value } = actionMeta.option;
                    const existingOptionIndex = currentValue.findIndex(
                      (option) => option.label === label
                    );
                    if (existingOptionIndex !== -1) {
                      currentValue.splice(existingOptionIndex, 1);
                    }
                    const newCollection: CollectionOption = {
                      value: value,
                      label: label,
                    };
                    const updatedValue = [...currentValue, newCollection];
                    onChange(updatedValue);
                  } else {
                    onChange(newValue);
                  }
                };

                return (
                  <Select
                    {...field}
                    isMulti
                    classNamePrefix="select"
                    isClearable={true}
                    isSearchable={true}
                    options={collectionOptions}
                    onChange={handleInputChange}
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
                    onChange={(e: SwitchEvent) =>
                      field.onChange(e.target.checked)
                    }
                  />
                )}
              />
              <label className="ml-2" htmlFor="publicationStatus">
                Publish
              </label>
            </div>
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
