import { useRouter } from "next/router";
import { MdKeyboardArrowLeft } from "react-icons/md";

const BackButton = () => {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <MdKeyboardArrowLeft
      className="mb-5 ml-5 text-4xl hover:cursor-pointer"
      onClick={goBack}
    />
  );
};

export default BackButton;
