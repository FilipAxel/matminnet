/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-no-undef */
import {
  Button,
  Checkbox,
  Grid,
  Input,
  Modal,
  Row,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";

interface IFormInput {
  name: string;
}

interface createRecipeDialogProps {
  catalogId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRecipeDialog: React.FC<createRecipeDialogProps> = ({
  catalogId,
  isOpen,
  setIsOpen,
}) => {
  const closeHandler = () => {
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
    },
  });

  const { isLoading, mutate: createCatalog } =
    api.recipe.createRecipe.useMutation();

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) => {
    setIsOpen(false);
    createCatalog({ catalogId: catalogId, name: FormdData.name });
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
          <Text id="modal-title">Create Recipe</Text>
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
            <Grid.Container gap={2} justify="flex-end">
              <Grid>
                <Button
                  type="button"
                  onClick={() => reset()}
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
