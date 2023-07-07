/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input, Modal, Text, Button, Spacer } from "@nextui-org/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

interface editRecipeActionDialogProps {
  id: string;
  name: string;
  isEditActionOpen: boolean;
  setEditActionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormInput {
  name: string;
}

const EditRecipeActionDialog: React.FC<editRecipeActionDialogProps> = ({
  id,
  name,
  isEditActionOpen,
  setEditActionOpen,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name,
    },
  });

  const { mutate: updateCatalog } = api.recipe.updateRecipe.useMutation({
    onSuccess() {
      setEditActionOpen(false);
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) =>
    updateCatalog({ id: id, name: FormdData.name });

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isEditActionOpen}
        className="mx-5"
        onClose={() => setEditActionOpen(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Edit {name}
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
                  aria-label={field.name}
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
                  clearable
                  bordered
                  fullWidth
                  placeholder={field.name}
                  {...field}
                  size="lg"
                />
              )}
            />
            <Spacer y={1.6} />
            <Modal.Footer>
              <Button
                auto
                flat
                color="error"
                onPress={() => setEditActionOpen(false)}
              >
                Close
              </Button>
              <Button color="primary" type="submit" flat auto>
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditRecipeActionDialog;
