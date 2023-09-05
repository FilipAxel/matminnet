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
    <div className="mx-auto mb-10 mt-2 flex flex-wrap justify-center gap-1 p-0 xs:max-w-[97%] xs:justify-normal md:justify-normal">
      {numberOfSkeletonsCards.map((n) => {
        return <SkeletoncollectionCard key={n} />;
      })}
    </div>;
  }

  if (status === "authenticated" || !isLoading) {
    return (
      <>
        {isLoading ? (
          <div className="mx-auto mb-10 mt-2 flex flex-wrap justify-center gap-5 p-0 xs:max-w-[97%] xs:justify-normal media428:max-w-[88%] md:justify-normal">
            {numberOfSkeletonsCards.map((n) => {
              return <SkeletoncollectionCard key={n} />;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="mx-auto mb-10 mt-2 flex flex-wrap justify-center gap-5 p-0 xs:max-w-[97%] xs:justify-normal media428:max-w-[88%] md:justify-normal">
              <div className="w-full xs:w-auto">
                <CreateCollection />
              </div>
              {collections?.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
}
