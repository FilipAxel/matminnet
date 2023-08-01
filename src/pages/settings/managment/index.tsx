import BackButton from "~/components/back-button";
import SettingsTable from "~/components/table/table";

const Managment = () => {
  return (
    <>
      <BackButton />
      <div className="m-4">
        <SettingsTable />
      </div>
    </>
  );
};

export default Managment;
