import { User, Col, Row, StyledBadge, Tooltip, Text } from "@nextui-org/react";
import { IconButton } from "./actions/IconButton";
import { useState, type Key } from "react";
import { type Recipe } from "@prisma/client";
import { EditIcon } from "./actions/EditIcon";
import { DeleteIcon } from "./actions/DeleteIcon";
import { api } from "~/utils/api";
import DeleteRecipeActionDialog from "../dialog/delete-recipe-action-dialog";

const RenderCell: React.FC<{ recipe: Recipe; columnKey: Key }> = ({
  recipe,
  columnKey,
}) => {
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const cellValue: string = recipe[columnKey] as string;

  switch (columnKey) {
    case "name":
      return (
        <User
          squared
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          name={cellValue}
          css={{ p: 0 }}
        >
          {recipe?.name}
        </User>
      );
    case "role":
      return (
        <Col>
          <Row>
            <Text b size={14} css={{ tt: "capitalize" }}>
              {cellValue}
            </Text>
          </Row>
          <Row>
            <Text b size={13} css={{ tt: "capitalize", color: "$accents7" }}>
              {recipe?.servingSize}
            </Text>
          </Row>
        </Col>
      );

    case "status":
      return <StyledBadge>{cellValue}</StyledBadge>;

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
