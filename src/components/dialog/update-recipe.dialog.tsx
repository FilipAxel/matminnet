/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  Input,
  Modal,
  Spacer,
  Switch,
  Textarea,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
  type IngredientOption,
  type FormValues,
  type CollectionOption,
  type TagOption,
} from "../create-recipe-from/from-interface";
import { api } from "~/utils/api";
import CollectionController from "../create-recipe-from/collection-controller";
import IngredientsController from "../create-recipe-from/ingredients-controller";
import { useEffect, useState } from "react";
import TagsController from "../create-recipe-from/tags.controller";

interface UpdateRecipeDialogProps {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateRecipeDialog: React.FC<UpdateRecipeDialogProps> = ({
  id,
  isOpen,
  setIsOpen,
}) => {
  const [isPublished, setIsPublished] = useState(false);

  const utils = api.useContext();
  const { data: recipe, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  const { mutate: deleteIngredientOnRecipe } =
    api.ingredient.deleteIngredientOnRecipe.useMutation();

  const { mutate: deleteRecipeOnCollection } =
    api.collection.deleteRecipeOnCollection.useMutation();

  const { mutate: deleteTagOnRecipe } = api.tag.deleteTagOnRecipe.useMutation();

  const { mutate: updateRecipe, isLoading: loadingUpdatedRecipe } =
    api.recipe.updateRecipe.useMutation({
      async onSuccess() {
        try {
          await utils.recipe.getAllRecipesForUser.invalidate();
          setIsOpen(false);
          reset();
        } catch (error) {
          console.log(error);
        }
      },
    });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      servingSize: "",
      cookingTime: null,
      video: "",
      country: "",
      author: "",
      tags: [],
      ingredients: [],
      collections: [],
      publicationStatus: false,
    },
  });

  const filterChangedIngredients = (ingredients: IngredientOption[]) => {
    const existingIngredients = recipe?.recipeIngredients || [];

    const ingredientsToDelete = existingIngredients.filter(
      (existingIngredient) =>
        !ingredients.some(
          (newIngredient) =>
            existingIngredient.ingredient.name === newIngredient.value
        )
    );

    for (const ingredient of ingredientsToDelete) {
      deleteIngredientOnRecipe({ id: ingredient.id });
    }

    return ingredients.filter((ingredient) => {
      const existingIngredient = existingIngredients.find(
        (existingIngredient) =>
          existingIngredient.ingredient.name === ingredient.value
      );
      if (!existingIngredient) {
        return true;
      }
      const hasQuantityUpdated =
        existingIngredient.quantity !== ingredient.quantity;
      const hasUnitUpdated = existingIngredient.unit !== ingredient.unit;

      if (hasQuantityUpdated || hasUnitUpdated) {
        return true;
      }

      return false;
    });
  };

  const filterChangedCollections = (collections: CollectionOption[]) => {
    const existingCollectionNames = (recipe?.collections || []).map(
      ({ collection }) => collection.name
    );

    const collectionsToDelete = existingCollectionNames.filter(
      (existingCollection) =>
        !collections.some(
          (newCollection) => existingCollection === newCollection.value
        )
    );

    for (const collectionNameToDelete of collectionsToDelete) {
      const collectionToDelete = recipe?.collections.find(
        ({ collection }) => collection.name === collectionNameToDelete
      );

      if (collectionToDelete) {
        deleteRecipeOnCollection({
          id: collectionToDelete.id,
        });
      }
    }

    return collections.filter((collection: CollectionOption) => {
      return !existingCollectionNames.includes(collection.value);
    });
  };

  const filterChangedTags = (tags: TagOption[]) => {
    const existingTags = recipe?.tags || [];

    const tagsToDelete = existingTags.filter(
      (existingTag) =>
        !tags.some((newTag) => existingTag.tag.name === newTag.value)
    );

    // Delete tags that are no longer selected
    for (const tagToDelete of tagsToDelete) {
      deleteTagOnRecipe({
        id: tagToDelete.id,
      });
    }

    const filteredTags = tags.filter((tag) => {
      return !existingTags.some(
        (existingTag) => existingTag.tag.name === tag.value
      );
    });

    return filteredTags;
  };

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    formData.publicationStatus = isPublished;
    formData.tags = filterChangedTags(formData.tags);
    formData.ingredients = filterChangedIngredients(formData.ingredients);
    formData.collections = filterChangedCollections(formData.collections);
    formData.cookingTime = Number(formData.cookingTime);
    updateRecipe({ id, recipe: formData });
  };

  const closeHandler = () => {
    setIsOpen(false);
    reset();
  };

  useEffect(() => {
    if (!isLoading && recipe) {
      setValue("name", recipe.name || "");
      setValue("description", recipe.description || "");

      setValue("servingSize", recipe.servingSize || "");
      setValue("cookingTime", recipe.cookingTime || null);
      setValue("video", recipe.video || "");
      setValue("country", recipe.country || "");
      setValue("author", recipe?.author?.name || "");

      const tagValues = recipe.tags.map((tag) => ({
        value: tag.tag.name,
        label: tag.tag.name,
      }));

      setValue("tags", tagValues);

      const ingredientValues = recipe.recipeIngredients.map((ingredient) => ({
        quantity: ingredient.quantity || "",
        unit: ingredient.unit || "",
        value: ingredient.ingredient.name,
        label: ingredient.ingredient.name,
      }));

      setValue("ingredients", ingredientValues);

      const collectionValues = recipe.collections.map(
        ({ collection: { name } }) => ({
          value: name,
          label: name,
        })
      );
      setValue("collections", collectionValues);

      const shouldSetPublicationStatus =
        recipe.publicationStatus === "unapproved" ||
        recipe.publicationStatus === "published";

      setValue("publicationStatus", shouldSetPublicationStatus);

      // Update the local isPublished state accordingly
      setIsPublished(shouldSetPublicationStatus);
    }
  }, [isLoading, recipe, setValue]);

  if (recipe) {
    return (
      <div>
        <Modal
          closeButton
          aria-labelledby="Update Recipe"
          scrollBehavior="inside"
          size="full"
          isOpen={isOpen}
          onClose={closeHandler}
        >
          <ModalContent>
            <ModalHeader className="justify-center">
              <h1 className="text-[30px] font-bold" id="create recipe">
                Update Recipe
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
                      isRequired
                      variant="faded"
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
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
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
                <Spacer y={5} />
                <label className="mb-2" htmlFor="ingredients">
                  Ingredients
                </label>
                <Spacer y={1} />
                <Controller
                  name="ingredients"
                  render={({ field }) => {
                    const currentValue = getValues("ingredients") || [];
                    return (
                      <IngredientsController
                        field={field}
                        currentValue={currentValue}
                      />
                    );
                  }}
                  control={control}
                />

                <Spacer y={1} />
                <label className="mb-2" htmlFor="tags">
                  Tags
                </label>
                <Spacer y={1} />
                <Controller
                  name="tags"
                  render={({ field }) => {
                    const currentValue = getValues("tags") || [];
                    return (
                      <TagsController
                        field={field}
                        currentValue={currentValue}
                      />
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
                      isClearable
                      aria-label={field.name}
                      fullWidth
                      label="Serving Size"
                      type="text"
                      {...field}
                      size="lg"
                    />
                  )}
                />
                <Spacer y={5} />
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
                      label="Cooking Time"
                      labelPlacement="outside"
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-small text-default-400">
                            Min/
                          </span>
                        </div>
                      }
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
                      radius="sm"
                      variant="faded"
                      isClearable
                      aria-label={field.name + "url"}
                      label="Youtube Link"
                      fullWidth
                      type="url"
                      {...field}
                      size="lg"
                    />
                  )}
                />
                <Spacer y={5} />
                <label htmlFor="collections">Collections</label>
                <Spacer y={1} />
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
                      radius="sm"
                      variant="faded"
                      isClearable
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
                      radius="sm"
                      variant="faded"
                      isClearable
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
                  <Switch
                    isSelected={isPublished}
                    color="success"
                    onValueChange={(value) => {
                      setIsPublished(value);
                    }}
                  />

                  <label className="ml-2" htmlFor="publicationStatus">
                    Share with Community
                  </label>
                </div>
                {isPublished && (
                  <p className="mt-5 max-w-[60ch] text-[#858585]">
                    By choosing to publish your recipe, you&apos;re sending it
                    to our administrators for review. After approval, your
                    recipe will be featured on the discovery page, making it
                    accessible to everyone.
                  </p>
                )}
                <Spacer y={5} />
                <div className="container mb-4 grid justify-end gap-2">
                  <div className="grid">
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={loadingUpdatedRecipe}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </form>
              <Spacer y={2.5} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  }
};

export default UpdateRecipeDialog;
