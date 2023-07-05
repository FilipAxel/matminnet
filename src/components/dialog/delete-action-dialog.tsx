import { Button, Modal } from "@nextui-org/react";
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
  const { mutate: deleteCatalog } = api.catalog.deleteCatalogWithId.useMutation(
    {
      onSuccess() {
        setDeleteActioOpen(false);
      },
    }
  );

  const handleDelete = () => deleteCatalog({ id: id });

  return (
    <div>
      <Modal
        closeButton
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

export default DeleteActionDialog;
