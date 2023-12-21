import SearchList from "~/components/SearchList";
import RecipeSearch from "~/components/RecipeSearch";

const Discover = () => {
  return (
    <>
      <RecipeSearch placeholder="Search Recipes..." />
      <SearchList publicSearch={true} publication={"published"} />
    </>
  );
};

export default Discover;
