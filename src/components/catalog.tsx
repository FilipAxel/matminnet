import { Avatar, Card, Dropdown, Grid, Row, Text } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import CreateCatalog from "./create-catalog";
import DeleteActionDialog from "./dialog/delete-action-dialog";
import { useState } from "react";
import Link from "next/link";
import { MdDelete, MdModeEdit, MdOutlineSettings } from "react-icons/md";
import EditActionDialog from "./dialog/edit-action-dialog";

type Key = string | number;

interface Catalog {
  id: string;
  name: string;
}

const Catalog = () => {
  const [isDeleteActionOpen, setDeleteActioOpen] = useState(false);
  const [isEditActionOpen, setEditActionOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);

  const { data: sessionData } = useSession();
  const { data: catalogs } = api.catalog.getCatalogs.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const handleDropDownAction = (option: Key, id: string) => {
    const filteredCatalog = catalogs?.filter((catalog) => catalog.id === id)[0];
    const catalog: Catalog = {
      id: filteredCatalog?.id || "",
      name: filteredCatalog?.name || "",
    };
    setSelectedCatalog(catalog);
    switch (option) {
      case "edit":
        console.log("edit");
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
      <Grid.Container alignItems="flex-start" gap={2}>
        <Grid>
          <CreateCatalog />
        </Grid>
        {catalogs?.map((catalog) => {
          return (
            <Grid key={catalog.id}>
              <Card css={{ width: "180px", height: "180px" }}>
                <Card.Body className="group relative" css={{ p: 0 }}>
                  <Link color="primary" href={"/catalogs/" + catalog?.id}>
                    <Card.Image
                      src={
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
                      }
                      showSkeleton
                      objectFit="cover"
                      width={"100%"}
                      height={130}
                      alt={catalog.name}
                    />
                  </Link>
                  <div className="absolute right-2 top-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <Avatar
                          size="sm"
                          as="button"
                          icon={<MdOutlineSettings />}
                        />
                      </Dropdown.Trigger>
                      <Dropdown.Menu
                        color="secondary"
                        aria-label="Avatar Actions"
                        onAction={(option) =>
                          handleDropDownAction(option, catalog.id)
                        }
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
                      {catalog?.name}
                    </Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          );
        })}
      </Grid.Container>
      {selectedCatalog?.name.length ? (
        <DeleteActionDialog
          id={selectedCatalog?.id}
          name={selectedCatalog?.name}
          isDeleteActionOpen={isDeleteActionOpen}
          setDeleteActioOpen={setDeleteActioOpen}
        />
      ) : null}
      {selectedCatalog?.name.length && isEditActionOpen && (
        <EditActionDialog
          id={selectedCatalog?.id}
          name={selectedCatalog?.name}
          isEditActionOpen={isEditActionOpen}
          setEditActionOpen={setEditActionOpen}
        />
      )}
    </>
  );
};

export default Catalog;
