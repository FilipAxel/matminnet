import SearchList from "~/components/SearchList";
import RecipeSearch from "~/components/RecipeSearch";

const Discover = () => {
  return (
    <>
      <RecipeSearch placeholder="Sök Recept..." />
      <SearchList publicSearch={true} publication={"published"} />
    </>
  );
};

export default Discover;
