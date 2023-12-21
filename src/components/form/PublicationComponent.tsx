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
  submitForm: (value: boolean) => void;
}

const PublicationComponent: React.FC<PublicationComponentProps> = ({
  isOpen,
  togglePublicationDialog,
  submitForm,
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
              <p className="  text-sm text-gray-700">
                Genom att välja att publicera ditt recept skickar du det till
                våra administratörer för granskning. Efter godkännande kommer
                ditt recept att visas på upptäcktsidan och bli tillgängligt för
                alla.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  submitForm(false);
                }}
              >
                Håll privat
              </Button>
              <Button
                color="success"
                className="  font-semibold text-white"
                endContent={<MdIosShare className="text-xl" />}
                onPress={() => {
                  submitForm(true);
                }}
              >
                Publicera
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default PublicationComponent;
