/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Avatar, Card, Dropdown, Grid, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineSettings } from "react-icons/md";
import Link from "next/link";
import EditRecipeActionDialog from "../dialog/edit-recipe-action-dialog";
import DeleteRecipeActionDialog from "../dialog/delete-recipe-action-dialog";

type Key = string | number;

const RecipeCard = ({ recipe }) => {
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const [isEditActionOpen, setEditActionOpen] = useState(false);

  const handleDropDownAction = (option: Key) => {
    switch (option) {
      case "edit":
        setEditActionOpen(true);
        break;
      case "delete":
        setDeleteActioOpen(true);

      default:
        break;
    }
  };

  return (
    <>
      <Grid>
        <Card className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]">
          <Card.Body className="group relative" css={{ p: 0 }}>
            <Link
              className="overflow-hidden"
              color="primary"
              href={`/recipe/${recipe?.id as string}`}
            >
              <Card.Image
                src={
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
                }
                showSkeleton
                objectFit="cover"
                width={"100%"}
                height={130}
                alt={recipe?.name}
              />
            </Link>
            <div className="absolute right-2 top-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Dropdown>
                <Dropdown.Trigger>
                  <Avatar size="sm" as="button" icon={<MdOutlineSettings />} />
                </Dropdown.Trigger>
                <Dropdown.Menu
                  color="secondary"
                  aria-label="Avatar Actions"
                  onAction={(option) => handleDropDownAction(option)}
                >
                  <Dropdown.Section title="Actions">
                    <Dropdown.Item
                      key="edit"
                      color="primary"
                      description="edit the catalog"
                      icon={<MdModeEdit size={22} fill="currentColor" />}
                    >
                      Edit
                    </Dropdown.Item>
                  </Dropdown.Section>

                  <Dropdown.Section title="Danger zone">
                    <Dropdown.Item
                      key="delete"
                      color="error"
                      description="Permanently delete catalog"
                      icon={<MdDelete size={22} fill="currentColor" />}
                    >
                      Delete file
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Body>
          <Card.Footer
            className="bg-slate-800"
            css={{ justifyItems: "flex-start" }}
          >
            <Row wrap="wrap" justify="space-between" align="center">
              <Text
                b
                css={{
                  color: "$accents1",
                }}
                className="truncate"
              >
                {recipe?.name}
              </Text>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>

      {isDeleteActionOpen && (
        <DeleteRecipeActionDialog
          id={recipe?.id}
          name={recipe?.name}
          isDeleteActionOpen={isDeleteActionOpen}
          setDeleteActioOpen={setDeleteActioOpen}
        />
      )}

      {isEditActionOpen && (
        <EditRecipeActionDialog
          id={recipe?.id}
          name={recipe.name}
          isEditActionOpen={isEditActionOpen}
          setEditActionOpen={setEditActionOpen}
        />
      )}
    </>
  );
};

export default RecipeCard;
