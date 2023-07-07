/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-no-undef */
import { Button, Grid, Input, Modal, Spacer, Text } from "@nextui-org/react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";

interface IFormInput {
  name: string;
  type: string;
}

interface CreateCatalogDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCatalogDialog: React.FC<CreateCatalogDialogProps> = ({
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
      type: "",
    },
  });

  const { isLoading, mutate: createCatalog } =
    api.catalog.createCatalog.useMutation({
      onSuccess() {
        console.log("success");
      },
    });

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) => {
    setIsOpen(false);
    createCatalog(FormdData);
  };

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isOpen}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title">Create Catalog</Text>
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
            {/*       <Controller
              name="type"
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
                  fullWidth
                  aria-label={field.name}
                  placeholder={field.name}
                  {...field}
                  color="primary"
                  size="lg"
                />
              )}
            />
            <Spacer y={1.6} /> */}
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

export default CreateCatalogDialog;
