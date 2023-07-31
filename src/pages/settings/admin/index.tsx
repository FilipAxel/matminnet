import { useSession } from "next-auth/react";
import PublicationList from "~/components/admin/publication-list";

const Admin = () => {
  const { data: session } = useSession();
  // Get the isAdmin value from the session data
  const isAdmin = session?.user?.isAdmin;

  // If no session exists, display access denied message
  if (!session || !isAdmin) {
    return <h1>you are not allowed</h1>;
  }

  // If session exists, display content
  return (
    <>
      <PublicationList />
    </>
  );
};

export default Admin;
