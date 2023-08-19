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
    <Grid.Container
      className="md:justify-normal mx-auto mb-10 mt-2 flex justify-center p-0 xs:max-w-[97%] xs:justify-normal"
      gap={1}
    >
      {numberOfSkeletonsCards.map((n) => {
        return <SkeletoncollectionCard key={n} />;
      })}
    </Grid.Container>;
  }

  if (status === "authenticated" || !isLoading) {
    return (
      <>
        {isLoading ? (
          <Grid.Container
            className="md:justify-normal mx-auto mb-10 mt-2 flex justify-center p-0 xs:max-w-[97%] xs:justify-normal"
            gap={1}
          >
            {numberOfSkeletonsCards.map((n) => {
              return <SkeletoncollectionCard key={n} />;
            })}
          </Grid.Container>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex w-full justify-center">
              <Grid.Container
                className="md:justify-normal mx-auto mb-10 mt-2 flex justify-center p-0 xs:max-w-[97%] xs:justify-normal"
                gap={1}
              >
                <Grid className="w-full xs:w-auto">
                  <CreateCollection />
                </Grid>
                {collections?.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </Grid.Container>
            </div>
          </div>
        )}
      </>
    );
  }
}
