import { Grid } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CollectionCard from "~/components/collection/collection-card";
import CreateCollection from "~/components/collection/create-collection";
import SkeletoncollectionCard from "~/components/skeleton/collection-card-skeletion";
import { api } from "~/utils/api";

export default function Home() {
  const { status, data: session } = useSession();
  const numberOfSkeletonsCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const router = useRouter();
  const { data: collections, isLoading } =
    api.collection.getCollections.useQuery(
      undefined, // no input
      { enabled: session?.user !== undefined }
    );

  if (status === "unauthenticated" && !session) {
    void router.push("/discover");
  }

  if (status === "loading" || isLoading) {
    return numberOfSkeletonsCards.map((n) => {
      <SkeletoncollectionCard key={n} />;
    });
  }

  if (status === "authenticated" || !isLoading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full justify-center">
            <Grid.Container
              className="mx-auto flex w-full max-w-[1200px] justify-center p-0"
              gap={1}
            >
              <Grid>
                <CreateCollection />
              </Grid>
              {collections?.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </Grid.Container>
          </div>
        </div>
      </>
    );
  }
}
