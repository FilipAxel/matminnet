import { Grid, Loading } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Catalog from "~/components/catalog";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import HomePageSkeleton from "~/components/skeleton/home-page-skeleton";

export default function Home() {
  const { data: sessionData, status } = useSession();
  console.log(status);

  if (status === "loading") {
    return (
      <Grid className="grid h-screen place-items-center">
        <Loading className="mb-10" size="xl" type="points-opacity" />
      </Grid>
    );
  }
  return (
    <>
      {sessionData && status === "authenticated" ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full justify-center">
            <Catalog />
          </div>
        </div>
      ) : (
        <>
          <HomePageSkeleton />
          <LoginActionDialog />
        </>
      )}
    </>
  );
}
