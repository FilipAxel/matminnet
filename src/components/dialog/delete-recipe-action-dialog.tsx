import { Button, Modal } from "@nextui-org/react";
import { api } from "~/utils/api";

interface DeleteRecipeActionDialogProps {
  id: string;
  name: string;
  isDeleteActionOpen: boolean;
  setDeleteActioOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteRecipeActionDialog: React.FC<DeleteRecipeActionDialogProps> = ({
  id,
  name,
  isDeleteActionOpen,
  setDeleteActioOpen,
}) => {
  const utils = api.useContext();

  const { mutate: deleteRecipe } = api.recipe.deleteRecipeWithId.useMutation({
    onSuccess() {
      void utils.recipe.getAllRecipes.invalidate();
      setDeleteActioOpen(false);
    },
  });

  const { mutate: deleteImagesFromAws } =
    api.recipe.deleteImagesFromAws.useMutation({});

  const handleDelete = () => {
    deleteRecipe({ id: id });
    deleteImagesFromAws({ id: id });
    setDeleteActioOpen(false);
  };

  return (
    <div>
      <Modal
        closeButton
        className="mx-5"
        aria-labelledby="modal-title"
        open={isDeleteActionOpen}
        onClose={() => setDeleteActioOpen(false)}
      >
        <Modal.Header className="text-2xl">Delete {name}?</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            onPress={() => setDeleteActioOpen(false)}
          >
            Cancel
          </Button>
          <Button auto flat color="error" onPress={() => handleDelete()}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteRecipeActionDialog;
