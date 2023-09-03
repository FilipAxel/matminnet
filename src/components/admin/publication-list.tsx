import { Grid, Card, Text, Button } from "@nextui-org/react";
import { api } from "~/utils/api";

const PublicationList = () => {
  const { data: publications, isLoading } =
    api.admin.getPendingPublications.useQuery();
  const utils = api.useContext();
  const { mutate: processPublicationRequests } =
    api.admin.processPublicationRequests.useMutation({
      onSuccess: (_data, _variables, _context) => {
        void utils.admin.getPendingPublications.invalidate();
      },
    });

  const handlePublication = (
    recipeId: string,
    action: "approve" | "decline"
  ) => {
    processPublicationRequests({
      action: action,
      recipeId: recipeId,
    });
  };

  if (publications && !isLoading) {
    return (
      <Grid.Container gap={2} justify="center">
        {publications && !isLoading
          ? publications.map((publication, index) => (
              <Grid key={index} xs={4}>
                <Card css={{ mw: "600px" }}>
                  <Card.Body>
                    <Text>{publication.recipe.name}</Text>
                    <Button
                      type="button"
                      onPress={() =>
                        handlePublication(publication.id, "approve")
                      }
                      auto
                      flat
                      color="primary"
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      onPress={() =>
                        handlePublication(publication.id, "decline")
                      }
                      auto
                      flat
                      color="primary"
                    >
                      Decline
                    </Button>
                  </Card.Body>
                </Card>
              </Grid>
            ))
          : null}
      </Grid.Container>
    );
  }
};

export default PublicationList;
