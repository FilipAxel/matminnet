import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { MdIosShare } from "react-icons/md";

interface PublicationComponentProps {
  isOpen: boolean;
  togglePublicationDialog: () => void;
  onSubmit: (value: boolean) => void;
}

const PublicationComponent: React.FC<PublicationComponentProps> = ({
  isOpen,
  togglePublicationDialog,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      onOpenChange={togglePublicationDialog}
    >
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex items-center gap-3">
              <h1>Share with Community</h1>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-700">
                By choosing to publish your recipe, you&apos;re sending it to
                our administrators for review. After approval, your recipe will
                be featured on the discovery page, making it accessible to
                everyone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onSubmit(false);
                }}
              >
                Keep Private
              </Button>
              <Button
                color="success"
                className="font-semibold text-white"
                endContent={<MdIosShare className="text-xl" />}
                onPress={() => {
                  onSubmit(true);
                }}
              >
                Publish
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default PublicationComponent;
