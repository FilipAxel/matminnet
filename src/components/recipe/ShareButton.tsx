import { Button } from "@nextui-org/react";
import { MdIosShare } from "react-icons/md";

const ShareButton = () => {
  return (
    <div className="mt-5 text-center">
      <Button
        size="sm"
        color="primary"
        startContent={<MdIosShare />}
        className="text-white"
      >
        Share
      </Button>
    </div>
  );
};

export default ShareButton;
