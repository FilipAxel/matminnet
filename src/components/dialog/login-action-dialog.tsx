import { Button, Modal, Row, Text } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginActionDialog = () => {
  return (
    <div>
      <Modal open={true} preventClose aria-labelledby="modal-title">
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Welcome to{" "}
            <Text b size={18}>
              Name of page
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text className="text-center" size={18}>
            Login in to continue using the site
          </Text>
          <Button
            flat
            color="default"
            size={"lg"}
            rounded
            className="text-center"
            onClick={() => void signIn()}
          >
            Sign in
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginActionDialog;
