import { User, Col, Row, Tooltip } from "@nextui-org/react";
import { IconButton } from "./actions/IconButton";
import { useState, type Key } from "react";
import { EditIcon } from "./actions/EditIcon";
import { DeleteIcon } from "./actions/DeleteIcon";
import DeleteRecipeActionDialog from "../dialog/delete-recipe-action-dialog";
import { StyledBadge } from "./actions/StyledBadge";
import { type RecipeWithImage } from "~/pages/recipes";

const RenderCell: React.FC<{ recipe: RecipeWithImage; columnKey: Key }> = ({
  recipe,
  columnKey,
}) => {
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const cellValue: string = recipe[columnKey] as string;
  const imageUrl = recipe?.images?.[0]?.name ?? "/recipe-placeholder.webp";

  switch (columnKey) {
    case "name":
      return (
        <User
          src={imageUrl}
          onErrorCapture={(event) => {
            const imgElement = event.currentTarget as HTMLImageElement;
            imgElement.src = "/recipe-placeholder.webp";
          }}
          squared
          name={cellValue}
          css={{ p: 0 }}
        >
          {recipe?.name}
        </User>
      );

    case "publicationStatus":
      return <StyledBadge type="private">{cellValue}</StyledBadge>;

    case "actions":
      return (
        <>
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit user">
                <IconButton
                  onClick={() => console.log("Edit user", recipe?.id)}
                >
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => setDeleteActioOpen(true)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>

          {isDeleteActionOpen && (
            <DeleteRecipeActionDialog
              id={recipe?.id}
              name={recipe?.name}
              isDeleteActionOpen={isDeleteActionOpen}
              setDeleteActioOpen={setDeleteActioOpen}
            />
          )}
        </>
      );

    default:
      return <>{cellValue}</>; // Default case returning the cellValue
  }
};

export default RenderCell;
