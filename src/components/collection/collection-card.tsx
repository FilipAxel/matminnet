import { Card, CardFooter, Image } from "@nextui-org/react";
import { type Collection } from "@prisma/client";
import { useRouter } from "next/router";
import { MdOutlineMenuBook } from "react-icons/md";

type CollectionWithImage = Collection & {
  image: { name: string }[];
  _count: {
    recipes: number;
  };
};
interface CollectionCardProps {
  collection: CollectionWithImage;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const router = useRouter();
  const imageUrl = collection?.image?.[0]?.name ?? "/recipe-placeholder.webp";

  const handleRoute = () => {
    void router.push(`/collection/${collection?.id}`);
  };

  return (
    <Card
      isPressable
      isHoverable
      onClick={() => handleRoute()}
      className="h-[260px] w-full bg-transparent xs:h-[240px] xs:w-[175px] sm:w-[210px]"
    >
      <Image
        removeWrapper
        alt="callection"
        width={100}
        height={100}
        className="z-0 h-full w-full object-cover"
        src={imageUrl}
      />
      <CardFooter className="absolute top-0 h-full flex-col items-start justify-end bg-gradient-to-t from-black via-transparent to-transparent">
        <h1 className="text-right font-semibold text-white">
          {collection.name}
        </h1>
        <div className="flex items-center">
          <MdOutlineMenuBook className="mr-1 flex items-center text-[#d1d1d1]" />
          <p className="mr-3 text-white">{collection._count.recipes} Recipes</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CollectionCard;
