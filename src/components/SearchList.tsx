import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import RecipeCard from "./recipe/recipe-card";
import { type RecipeWithImage } from "~/pages/recipes";
import { useSearchParams } from "next/navigation";
import SkeletonRecipeCard from "./skeleton/recipe-card-skeletion";

const SearchList = ({
  publicSearch,
  publication,
  collection,
}: {
  publicSearch: boolean;
  publication?: string;
  collection?: string;
}) => {
  const numberOfSkeletonsCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
    const countries = params.get("countries");
    const querySearch = params.get("query");
    const cookingTime = params.get("cookingTime");
    const tagsArray = tags ? tags.split(",") : [];
    const countriesArray = countries ? countries.split(",") : [];

    const filters = {
      tags: tagsArray || undefined,
      countries: countriesArray || undefined,
      cookingTime: Number(cookingTime) || undefined,
      collection,
    };
    getRecipes({
      query: querySearch || "",
      filters,
      publication,
      publicSearch,
    });
  }, [collection, getRecipes, publicSearch, publication, searchParams]);

  return (
    <>
      {isLoading && recipesData.length === 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-3 p-3 xs:justify-start media428:ml-2 sm:justify-start md:ml-4">
          {numberOfSkeletonsCards.map((n) => {
            return <SkeletonRecipeCard key={n} />;
          })}
        </div>
      )}

      {isSuccess && data?.recipes.length === 0 ? (
        <div className="p-5">
          <h1 className="font-bold">Inga sökresultat hittades...</h1>
          <p className="text-gray-600">
            Försök ändra dina söktermer eller ta bort några av dina filter.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap justify-center gap-3 p-3 xs:justify-start media428:ml-2 sm:justify-start md:ml-4">
          {recipesData.map((recipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
        </div>
      )}
    </>
  );
};

export default SearchList;
