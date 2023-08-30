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
  Loading,
} from "@nextui-org/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
  type IngredientOption,
  type FormValues,
  CollectionOption,
} from "../create-recipe-from/from-interface";
import { api } from "~/utils/api";
import CollectionController from "../create-recipe-from/collection-controller";
import QuillEditor from "../quill/quill-editor";
import IngredientsController from "../create-recipe-from/ingredients-controller";
import { useEffect, useState } from "react";

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
  const [quillContent, setQuillContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const utils = api.useContext();

  const { data: recipe, isLoading } = api.recipe.getRecipeWithId.useQuery({
    id,
  });

  const { mutate: updateRecipe, isLoading: loadingUpdatedRecipe } =
    api.recipe.updateRecipe.useMutation({
      async onSuccess() {
        try {
          await utils.recipe.getAllRecipes.invalidate();
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
      directions: "",
      servingSize: "",
      cookingTime: null,
      video: "",
      country: "",
      author: "",
      ingredients: [],
      collections: [],
      publicationStatus: false,
    },
  });

  const { mutate: deleteIngredient } =
    api.ingredient.deleteIngredient.useMutation();

  const { mutate: deleteRecipeOnCollection } =
    api.collection.deleteRecipeOnCollection.useMutation();

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
      deleteIngredient({ id: ingredient.id });
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

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    formData.ingredients = filterChangedIngredients(formData.ingredients);
    formData.collections = filterChangedCollections(formData.collections);
    formData.cookingTime = Number(formData.cookingTime);
    formData.directions = quillContent;
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
      setValue("directions", recipe.directions || "");
      setValue("servingSize", recipe.servingSize || "");
      setValue("cookingTime", recipe.cookingTime || null);
      setValue("video", recipe.video || "");
      setValue("country", recipe.country || "");
      setValue("author", recipe?.author?.name || "");
      setQuillContent(recipe?.directions || "");

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

      setIsPublished(recipe.publicationStatus === "published");
    }
  }, [isLoading, recipe, setValue]);

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
            Update Recipe
          </Text>
        </Modal.Header>
        <Modal.Body className="mx-2 mb-3">
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
                  <IngredientsController
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
                  {loadingUpdatedRecipe ? <Loading size={"md"} /> : "Update"}
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

export default UpdateRecipeDialog;
