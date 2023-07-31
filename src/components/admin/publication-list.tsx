import { Button, Container, Grid, Loading, Table } from "@nextui-org/react";
import { useState } from "react";
import { api } from "~/utils/api";

const columns = [
  {
    key: "username",
    label: "USER NAME",
  },
  {
    key: "recipename",
    label: "Recipe Name",
  },
  {
    key: "userId",
    label: "User ID",
  },

  {
    key: "recipeId",
    label: "RECIPE ID",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

type Selection = "all" | Set<React.Key>;
const PublicationList = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Selection>();
  const { data, isLoading } = api.admin.getPendingPublications.useQuery();

  const { mutate: updateApproval } = api.admin.approvePublication.useMutation();
  const { mutate: updateDecline } = api.admin.declinePublication.useMutation();

  const handelApprove = () => {
    if (selectedRecipe === "all") {
      console.log("Selected Recipe:", selectedRecipe);
      const arrayOfIds =
        data?.recipes && Array.isArray(data.recipes)
          ? data.recipes.map((obj) => obj.id)
          : [];
      updateApproval(arrayOfIds);
    } else if (selectedRecipe instanceof Set) {
      const selectedRecipeArray = Array.from(selectedRecipe);
      updateApproval(selectedRecipeArray as string[]);
    }
    // Reset selectedRecipe after approval
    setSelectedRecipe(undefined);
  };

  const handelDecline = () => {
    if (selectedRecipe === "all") {
      const arrayOfIds =
        data?.recipes && Array.isArray(data.recipes)
          ? data.recipes.map((obj) => obj.id)
          : [];
      updateDecline(arrayOfIds);
      console.log("Selected Recipe:", selectedRecipe);
    } else if (selectedRecipe instanceof Set) {
      const selectedRecipeArray = Array.from(selectedRecipe);
      updateDecline(selectedRecipeArray as string[]);
    }
    setSelectedRecipe(undefined);
  };
  return (
    <>
      {isLoading ? (
        <Grid className="grid h-screen place-items-center">
          <Loading className="mb-10" size="xl" type="points-opacity" />
        </Grid>
      ) : (
        <Container fluid>
          <Table
            selectionMode="multiple"
            color="success"
            aria-label="Example table with custom cells"
            onSelectionChange={(select) => setSelectedRecipe(select)}
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column key={column.key}>{column.label}</Table.Column>
              )}
            </Table.Header>

            <Table.Body items={data?.recipes}>
              {(recipe) => (
                <Table.Row key={recipe.id}>
                  {(columnKey) => {
                    if (columnKey === "username") {
                      return (
                        <Table.Cell>{recipe.user?.name || "-"}</Table.Cell>
                      );
                    } else if (columnKey === "recipename") {
                      return (
                        <Table.Cell>{recipe.recipe?.name || "-"}</Table.Cell>
                      );
                    } else {
                      return <Table.Cell>{recipe[columnKey]}</Table.Cell>;
                    }
                  }}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <Grid.Container justify="flex-end" gap={2}>
            <Grid>
              <Button
                auto
                onPress={() => handelApprove()}
                disabled={
                  !selectedRecipe ||
                  (typeof selectedRecipe === "object" &&
                    selectedRecipe.size === 0)
                }
                bordered
                color="primary"
              >
                Approve
              </Button>
            </Grid>
            <Grid>
              <Button
                auto
                onPress={() => handelDecline()}
                disabled={
                  !selectedRecipe ||
                  (typeof selectedRecipe === "object" &&
                    selectedRecipe.size === 0)
                }
                bordered
                color="primary"
              >
                Decline
              </Button>
            </Grid>
          </Grid.Container>
        </Container>
      )}
    </>
  );
};

export default PublicationList;
