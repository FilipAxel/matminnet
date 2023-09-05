import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import RenderCell from "./cell";
import { api } from "~/utils/api";
import { type RecipeWithImage } from "~/pages/recipes";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "STATUS", uid: "publicationStatus" },
  { name: "ACTIONS", uid: "actions" },
];

const SettingsTable = () => {
  const { data: recipes, isLoading } =
    api.recipe.getAllRecipesForUser.useQuery();

  return (
    <>
      {isLoading ? (
        <div className="grid h-screen place-items-center">
          <Spinner className="mb-10" size="lg" />
        </div>
      ) : (
        <Table
          selectionMode="single"
          aria-label="recipe overview"
          className="h-auto min-w-full"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={"No rows to display."} items={recipes}>
            {(recipe: RecipeWithImage) => (
              <TableRow>
                {(columnKey) => (
                  <TableCell>
                    {<RenderCell recipe={recipe} columnKey={columnKey} />}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default SettingsTable;
