import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RecipeCard from "~/components/recipe/recipe-card";
import { api } from "~/utils/api";

const TagPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { query } = router;
  const tag = query.tag as string;

  const { data, isLoading } = api.tag.getRecipeWithTag.useQuery({
    name: tag,
    userId: session?.user.id || undefined,
  });

  return (
    <>
      <div className="px-4">
        <h1 className="mb-3 mt-8 text-center text-4xl font-bold">
          Recipes With The Tag: {tag}
        </h1>
        <p className="mb-8 text-center text-lg text-gray-600">
          Explore delicious recipes associated with the tag &quot;{tag}&quot;.
          Get inspired and enjoy cooking!
        </p>
      </div>
      {isLoading && <p className="text-center text-gray-600">Loading...</p>}
      {!isLoading && !data?.recipes && (
        <h2 className="text-center text-2xl font-bold">
          No recipes found for the tag &quot;{tag}&quot;.
        </h2>
      )}
      <div className="mx-auto mb-10 mt-4 flex flex-wrap justify-center gap-5 p-0  xs:max-w-[90%]  xs:justify-normal media428:max-w-[88%]  md:justify-normal">
        {!isLoading &&
          data?.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
    </>
  );
};

export default TagPage;
