import { useSession } from "next-auth/react";
import Catalog from "~/components/catalog";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import HomePageSkeleton from "~/components/skeleton/home-page-skeleton";

export default function Home() {
  const { data: sessionData } = useSession();
  return (
    <>
      {sessionData ? null : (
        <>
          <HomePageSkeleton />
          <LoginActionDialog />
        </>
      )}
      <div className="flex flex-col items-center justify-center gap-4">
        {sessionData && (
          <div>
            <Catalog />
          </div>
        )}
      </div>
    </>
  );
}
