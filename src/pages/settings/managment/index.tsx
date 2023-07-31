import { useRouter } from "next/router";
import { MdArrowCircleLeft } from "react-icons/md";
import SettingsTable from "~/components/table/table";

const Managment = () => {
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <>
      <MdArrowCircleLeft
        className="mb-5 ml-5 text-4xl hover:cursor-pointer"
        onClick={goBack}
      />
      <div className="m-4">
        <SettingsTable />
      </div>
    </>
  );
};

export default Managment;
