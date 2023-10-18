import { User, Chip } from "@nextui-org/react";
import { useState, type Key } from "react";
import DeleteRecipeActionDialog from "../dialog/delete-recipe-action-dialog";

import { type RecipeWithImage } from "~/pages/recipes";
import UpdateRecipeDialog from "../dialog/update-recipe.dialog";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";

const RenderCell: React.FC<{ recipe: RecipeWithImage; columnKey: Key }> = ({
  recipe,
  columnKey,
}) => {
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const [editActionIsOpen, setEditActionIsOpen] = useState(false);
  const cellValue: string = recipe[columnKey] as string;
  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";

  switch (columnKey) {
    case "name":
      return (
        <User
          className="p-0"
          avatarProps={{
            src: imageUrl,
          }}
          onErrorCapture={(event) => {
            const imgElement = event.currentTarget as HTMLImageElement;
            imgElement.src = "/recipe-placeholder.webp";
          }}
          name={cellValue}
        >
          {recipe?.name}
        </User>
      );

    case "publicationStatus":
      return (
        <Chip
          className="capitalize"
          color={
            recipe.publicationStatus === "published" ? "success" : "primary"
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
          {editActionIsOpen ? (
            <UpdateRecipeDialog
              id={recipe.id}
              isOpen={editActionIsOpen}
              setIsOpen={setEditActionIsOpen}
            />
          ) : null}
        </>
      );

    default:
      return <>{cellValue}</>; // Default case returning the cellValue
  }
};

export default RenderCell;
