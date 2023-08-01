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
import { Fragment } from "react";

interface CatalogOption {
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
  video: string;
  country: string;
  author: string;
  catalog: CatalogOption;
  publicationStatus: boolean;
}

interface createRecipeDialogProps {
  catalogName?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRecipeDialog: React.FC<createRecipeDialogProps> = ({
  catalogName,
  isOpen,
  setIsOpen,
}) => {
  const closeHandler = () => {
    setIsOpen(false);
    reset();
  };

  const { data } = api.ingredient.getAllIngredients.useQuery();
  const ingredientOptions: IngredientOption[] =
    data?.map((item: { name: string }) => ({
      value: item.name,
      label: item.name,
      quantity: "1",
      unit: "st",
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
      video: "",
      country: "",
      author: "",
      catalog: {
        value: catalogName ? catalogName : "",
        label: catalogName ? catalogName : "",
      },
      ingredients: [],
      publicationStatus: false,
    },
  });

  const { mutate: createRecipe } = api.recipe.createRecipe.useMutation();
  const { data: catalogs } = api.catalog.getCatalogs.useQuery(
    undefined // no input
  );

  const onSubmit: SubmitHandler<FormValues> = (formdData) => {
    setIsOpen(false);
    console.log(formdData);
    createRecipe({
      recipe: formdData,
    });
    reset();
  };

  return (
    <div>
      <Modal
        closeButton
        className="mx-5"
        aria-labelledby="modal-title"
        open={isOpen}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text size={30} weight="bold" h1 id="modal-title">
            Create Recipe
          </Text>
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
              rules={{ required: true }}
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
                  label="Youtube Url"
                  fullWidth
                  type="url"
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1} />
            <label htmlFor="catalog">Catalog</label>
            <Controller
              name="catalog"
              control={control}
              render={({ field }) => (
                <Select
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  {...field}
                  options={catalogs?.map((catalog) => {
                    return { value: catalog.id, label: catalog.name };
                  })}
                />
              )}
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

export default CreateRecipeDialog;
