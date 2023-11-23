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

const LoginActionDialog = () => {
  const router = useRouter(); // Get the router instance

  const handleClose = () => {
    // Redirect the user to a specific page when the modal is closed
    void router.push("/");
  };

  const routeName = router.pathname.substring(1);
  return (
    <div>
      <Modal
        onClose={handleClose}
        className="mx-5"
        placement="center"
        isOpen={true}
        aria-labelledby="login"
      >
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <h1 className="text-center text-[24px] font-bold">Welcome!</h1>
            <h2 className="pb-5 text-center text-[20px]">
              To access {routeName} page, please create an account or log in.
            </h2>
            <Button
              color="primary"
              size={"lg"}
              className="my-4 text-center"
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
