import { useSession } from "next-auth/react";
import PublicationList from "~/components/admin/publication-list";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import BackButton from "~/components/shared/back-button";

const Admin = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.isAdmin;

  if (!isAdmin && status !== "loading") {
    return <LoginActionDialog />;
  }

  // If session exists, display content
  return (
    <>
      {isAdmin && status !== "loading" && (
        <>
          <BackButton />
          <PublicationList />
        </>
      )}
    </>
  );
};

export default Admin;
