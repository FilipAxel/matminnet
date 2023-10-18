import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
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
      void utils.recipe.getAllRecipesForUser.invalidate();
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
    <Modal
      placement="auto"
      closeButton
      className="mx-5"
      aria-labelledby="Delete Recipe"
      isOpen={isDeleteActionOpen}
      onClose={() => setDeleteActioOpen(false)}
    >
      <ModalContent>
        <ModalHeader className="text-2xl">Delete {name}?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete {name}? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => setDeleteActioOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onPress={() => handleDelete()}>
            Yes, Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteRecipeActionDialog;
