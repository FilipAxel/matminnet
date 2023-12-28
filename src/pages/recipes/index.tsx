import { type Recipe } from "@prisma/client";
import RecipeSearch from "~/components/RecipeSearch";
import SearchList from "~/components/SearchList";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const Recipes = () => {
  return (
    <>
      <RecipeSearch placeholder="Sök Recept..." />
      <SearchList publicSearch={false} />
    </>
  );
};

export default Recipes;
