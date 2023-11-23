import { User, Chip } from "@nextui-org/react";
import { useState, type Key } from "react";
import DeleteRecipeActionDialog from "../dialog/delete-recipe-action-dialog";

import { type RecipeWithImage } from "~/pages/recipes";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { useRouter } from "next/router";

const RenderCell: React.FC<{ recipe: RecipeWithImage; columnKey: Key }> = ({
  recipe,
  columnKey,
}) => {
  const router = useRouter();
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const [editActionIsOpen, setEditActionIsOpen] = useState(false);
  const cellValue: string = recipe[
    columnKey as keyof RecipeWithImage
  ] as string;

  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";

  switch (columnKey) {
    case "name":
      return (
        <User
          className="cursor-pointer p-0"
          avatarProps={{
            src: imageUrl,
          }}
          onErrorCapture={(event) => {
            const imgElement = event.currentTarget as HTMLImageElement;
            imgElement.src = "/recipe-placeholder.webp";
          }}
          name={cellValue}
          onClick={(_) => void router.push(`/recipe/${recipe?.id}`)}
        >
          {recipe?.name}
        </User>
      );

    case "publicationStatus":
      return (
        <Chip
          className="capitalize"
          color={
            recipe.publicationStatus === "published"
              ? "success"
              : recipe.publicationStatus === "private"
              ? "danger"
              : "warning"
          }
          size="sm"
          variant="flat"
        >
          {cellValue}
        </Chip>
      );

    case "actions":
      return (
        <>
          <div className=" flex items-center justify-center gap-5">
            <div className="flex cursor-pointer">
              <MdModeEditOutline
                onClick={() => setEditActionIsOpen(true)}
                className="text-2xl text-green-600"
              />
            </div>
            <div className="flex cursor-pointer">
              <MdDeleteForever
                onClick={() => setDeleteActioOpen(true)}
                className="text-2xl text-red-700"
              />
            </div>
          </div>

          {isDeleteActionOpen && (
            <DeleteRecipeActionDialog
              id={recipe?.id}
              name={recipe?.name}
              isDeleteActionOpen={isDeleteActionOpen}
              setDeleteActioOpen={setDeleteActioOpen}
            />
          )}
          {editActionIsOpen ? null : null}
        </>
      );

    default:
      return <>{cellValue}</>; // Default case returning the cellValue
  }
};

export default RenderCell;
