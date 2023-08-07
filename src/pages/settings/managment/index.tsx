import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackButton from "~/components/shered/back-button";
import SettingsTable from "~/components/table/table";

const Managment = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated" && !session) {
    void router.push("/404");
  }

  if (status !== "loading") {
    return (
      <>
        <BackButton />
        <div className="m-4">
          <SettingsTable />
        </div>
      </>
    );
  }
};

export default Managment;
