import { Button, Modal, Text } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const LoginActionDialog = ({ pageName }) => {
  const router = useRouter(); // Get the router instance

  const handleClose = () => {
    // Redirect the user to a specific page when the modal is closed
    void router.push("/public");
  };

  return (
    <div>
      <Modal
        onClose={handleClose}
        className="mx-5"
        open={true}
        aria-labelledby="login"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <Text className="text-center" size={18}>
            Welcome! To access {pageName} page, please create an account or log
            in.
          </Text>
          <Button
            flat
            color="default"
            size={"lg"}
            rounded
            className="text-center"
            onPress={() => void signIn()}
          >
            Sign in
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginActionDialog;
