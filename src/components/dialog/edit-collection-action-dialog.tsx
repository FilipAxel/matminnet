/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input, Modal, Text, Button, Spacer } from "@nextui-org/react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

interface editActionDialogProps {
  id: string;
  name: string;
  isEditActionOpen: boolean;
  setEditActionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormInput {
  name: string;
}

const EditActionDialog: React.FC<editActionDialogProps> = ({
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

  const { mutate: updateCollection } =
    api.collection.updateCollection.useMutation({
      onSuccess() {
        setEditActionOpen(false);
      },
    });

  const onSubmit: SubmitHandler<IFormInput> = (FormdData) =>
    updateCollection({ id: id, name: FormdData.name });

  return (
    <div>
      <Modal
        closeButton
        className="mx-5"
        aria-labelledby="modal-title"
        open={isEditActionOpen}
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

export default EditActionDialog;
