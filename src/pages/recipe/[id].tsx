import { useRouter } from "next/router";
import RecipeSection from "~/components/recipe/RecipeSection";

const Recipe = () => {
  const router = useRouter();
  const { query } = router;
  const id = query.id as string;

  return id && <RecipeSection id={id} />;
};

export default Recipe;
