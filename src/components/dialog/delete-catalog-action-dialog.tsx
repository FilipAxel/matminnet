import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { api } from "~/utils/api";

interface DeleteActionDialogProps {
  id: string;
  name: string;
  isDeleteActionOpen: boolean;
  setDeleteActioOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteActionDialog: React.FC<DeleteActionDialogProps> = ({
  id,
  name,
  isDeleteActionOpen,
  setDeleteActioOpen,
}) => {
  const { mutate: deleteCollection } =
    api.collection.deleteCollectionWithId.useMutation({
      onSuccess() {
        setDeleteActioOpen(false);
      },
    });

  const handleDelete = () => deleteCollection({ id: id });

  return (
    <div>
      <Modal
        closeButton
        placement="auto"
        className="mx-5"
        aria-labelledby="Delete Catalog"
        isOpen={isDeleteActionOpen}
        onClose={() => setDeleteActioOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="text-2xl">Delete {name}?</ModalHeader>
          <ModalBody>
            Are you sure you want to delete {name}? This action cannot be
            undone.
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
    </div>
  );
};

export default DeleteActionDialog;
