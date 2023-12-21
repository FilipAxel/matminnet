import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import RecipeCard from "./recipe/recipe-card";
import { type RecipeWithImage } from "~/pages/recipes";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";

const SearchList = ({
  publicSearch,
  publication,
}: {
  publicSearch: boolean;
  publication?: string;
}) => {
  const searchParams = useSearchParams();
  const [recipesData, setRecipesData] = useState<RecipeWithImage[]>([]);

  const {
    mutate: getRecipes,
    data,
    isLoading,
    isSuccess,
  } = api.searchRouter.searchRecipe.useMutation({
    onSuccess: (data) => {
      if (data.status === "success") {
        setRecipesData(data.recipes);
      }
    },
    retry: 3,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const tags = params.get("tags");
    const querySearch = params.get("query");
    const cookingTime = params.get("cookingTime");
    const tagsArray = tags ? tags.split(",") : [];

    const filters = {
      tags: tagsArray || undefined,
      cookingTime: Number(cookingTime) || undefined,
    };
    getRecipes({
      query: querySearch || "",
      filters,
      publication,
      publicSearch,
    });
  }, [getRecipes, publicSearch, publication, searchParams]);

  return (
    <>
      {isLoading && recipesData.length === 0 && (
        <div className="grid h-[70vh] place-items-center">
          <Spinner size="lg" />
        </div>
      )}

      {isSuccess && data?.recipes.length === 0 ? (
        <div className="p-5">
          <h1 className="font-bold">No Search result found...</h1>
          <p className="text-gray-600">
            Try chaning your seach terms or removing some of your filters.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap justify-center gap-5 p-3 sm:justify-start">
          {recipesData.map((recipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
        </div>
      )}
    </>
  );
};

export default SearchList;
