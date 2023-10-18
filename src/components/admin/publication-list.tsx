import { Card, Button, CardBody, CardHeader } from "@nextui-org/react";
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
      <div className="container flex justify-center gap-5">
        {publications && !isLoading
          ? publications.map((publication, index) => (
              <Card key={index} className="h-[250px] w-[250px] max-w-[600px]">
                <CardHeader className="flex flex-wrap">
                  <h1>{publication.recipe.name}</h1>
                  <h2>{publication.user.name}</h2>
                  <p>{publication.userId}</p>
                </CardHeader>
                <CardBody className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    onPress={() => handlePublication(publication.id, "approve")}
                    variant="solid"
                    color="primary"
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    onPress={() => handlePublication(publication.id, "decline")}
                    variant="solid"
                    color="primary"
                  >
                    Decline
                  </Button>
                </CardBody>
              </Card>
            ))
          : null}
      </div>
    );
  }
};

export default PublicationList;
