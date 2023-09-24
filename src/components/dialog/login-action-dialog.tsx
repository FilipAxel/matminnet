import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

interface LoginActionDialogProps {
  pageName: string;
}

const LoginActionDialog: React.FC<LoginActionDialogProps> = ({ pageName }) => {
  const router = useRouter(); // Get the router instance

  const handleClose = () => {
    // Redirect the user to a specific page when the modal is closed
    void router.push("/discover");
  };

  return (
    <div>
      <Modal
        onClose={handleClose}
        className="mx-5"
        placeholder="center"
        isOpen={true}
        aria-labelledby="login"
      >
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <h2 className="text-center font-[18px]">
              Welcome! To access {pageName} page, please create an account or
              log in.
            </h2>
            <Button
              color="default"
              size={"lg"}
              className="text-center"
              onPress={() => void signIn()}
            >
              Sign in
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LoginActionDialog;
