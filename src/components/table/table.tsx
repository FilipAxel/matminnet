import { Table, Grid, Loading } from "@nextui-org/react";
import RenderCell from "./cell";
import { api } from "~/utils/api";
import { type Recipe } from "@prisma/client";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PUBLICATION STATUS", uid: "publicationStatus" },
  { name: "COUNTRY", uid: "country" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "DIRECTION", uid: "direction" },
  { name: "SERVING SIZE", uid: "servingSize" },
  { name: "VIDEO", uid: "video" },
  { name: "ACTIONS", uid: "actions" },
];

const SettingsTable = () => {
  const { data: recipes, isLoading } = api.recipe.getAllRecipes.useQuery();

  return (
    <>
      {isLoading ? (
        <Grid className="grid h-screen place-items-center">
          <Loading className="mb-10" size="xl" type="points-opacity" />
        </Grid>
      ) : (
        <Table
          selectionMode="single"
          aria-label="Example table with custom cells"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>

          <Table.Body items={recipes}>
            {(recipe: Recipe) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>
                    {<RenderCell recipe={recipe} columnKey={columnKey} />}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </>
  );
};

export default SettingsTable;
