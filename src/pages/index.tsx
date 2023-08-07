import { Grid, Loading } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import CatalogCard from "~/components/catalog/catalog-card";
import CreateCatalog from "~/components/catalog/create-catalog";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import { api } from "~/utils/api";

export default function Home() {
  const { status, data: session } = useSession();

  const { data: catalogs, isLoading } = api.catalog.getCatalogs.useQuery(
    undefined, // no input
    { enabled: session?.user !== undefined }
  );

  if (status === "unauthenticated" && !session) {
    return <LoginActionDialog pageName={"catalog"} />;
  }

  if (status === "loading" || isLoading) {
    return (
      <Grid className="grid h-screen place-items-center">
        <Loading className="mb-10" size="xl" type="points-opacity" />
      </Grid>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full justify-center">
          <Grid.Container
            className="mx-auto flex w-full max-w-[1200px] justify-start"
            gap={2}
          >
            <Grid>
              <CreateCatalog />
            </Grid>
            {catalogs?.map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </Grid.Container>
        </div>
      </div>
    </>
  );
}
