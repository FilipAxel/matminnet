import { type Recipe } from "@prisma/client";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const CollectionPage = () => {
  return <h1>in progress</h1>;
};

export default CollectionPage;
