import { Spinner } from "@nextui-org/react";
import { type Recipe } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BackButton from "~/components/shared/back-button";

import { api } from "~/utils/api";
import RecipeCard from "~/components/recipe/recipe-card";

export type RecipeWithImage = Recipe & {
  images: { name: string }[];
};

const CollectionPage = () => {
  return <h1>in progress</h1>;
};

export default CollectionPage;
