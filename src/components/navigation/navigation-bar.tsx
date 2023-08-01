/* eslint-disable react/jsx-no-undef */
import {
  Navbar,
  Dropdown,
  Avatar,
  Text,
  Link,
  Button,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import { useRouter } from "next/router";

type Key = string | number;

const NavigationBar = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const collapseItems = [
    { name: "Catalog", path: "/" },
    { name: "Recipes", path: "/recipes" },
    { name: "Public", path: "/public" },
  ];

  const handleDropDownAction = async (option: Key) => {
    switch (option) {
      case "logout":
        try {
          await signOut();
        } catch (error) {
          console.warn(error);
          throw error;
        }
        break;
      case "settings":
        await router.push("/settings").catch((error) => {
          console.warn(error);
          throw error;
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navbar isBordered variant="floating">
        <Navbar.Toggle showIn="xs" />
        <Navbar.Brand
          css={{
            "@xs": {
              w: "12%",
            },
          }}
        >
          <Text b color="inherit" hideIn="xs">
            MatMinnet
          </Text>
        </Navbar.Brand>
        <Navbar.Content
          enableCursorHighlight
          activeColor="primary"
          hideIn="xs"
          variant="highlight"
        >
          <Navbar.Link isActive={router.pathname === "/"} href="/">
            Catalog
          </Navbar.Link>
          <Navbar.Link
            isActive={router.pathname === "/recipes"}
            href="/recipes"
          >
            Recipes
          </Navbar.Link>
          <Navbar.Link isActive={router.pathname === "/public"} href="/public">
            Public
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content
          css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          {status === "authenticated" || status === "loading" ? (
            <Dropdown placement="bottom-right">
              <Navbar.Item>
                <Dropdown.Trigger>
                  <Avatar
                    className="cursor-pointer"
                    bordered
                    color="secondary"
                    src={session?.user?.image as string}
                    text={session?.user?.name as string}
                    size="md"
                  />
                </Dropdown.Trigger>
              </Navbar.Item>
              <Dropdown.Menu
                disabledKeys={["profile"]}
                color="secondary"
                aria-label="Avatar Actions"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onAction={handleDropDownAction}
              >
                <Dropdown.Item
                  textValue="profile"
                  key="profile"
                  css={{ height: "$18" }}
                >
                  <Text
                    className="text-black"
                    b
                    color="inherit"
                    css={{ d: "flex" }}
                  >
                    Signed in as
                  </Text>
                  <Text
                    className="text-black"
                    b
                    color="inherit"
                    css={{ d: "flex" }}
                  >
                    {session?.user?.email}
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item
                  textValue="settings"
                  withDivider
                  key="settings"
                  css={{ height: "$18" }}
                >
                  <Text b color="inherit" css={{ d: "flex" }}>
                    Settings
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item
                  textValue="logout"
                  key="logout"
                  color="error"
                  withDivider
                  icon={<MdOutlineLogout size={22} fill="currentColor" />}
                >
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Navbar.Item>
                <Button onPress={() => void signIn()} auto flat>
                  Sign Up
                </Button>
              </Navbar.Item>
            </>
          )}
        </Navbar.Content>
        <Navbar.Collapse>
          {collapseItems.map((item) => (
            <Navbar.CollapseItem
              key={item.name}
              activeColor="primary"
              isActive={router.pathname === item.path}
            >
              <Link
                color="inherit"
                css={{
                  minWidth: "100%",
                }}
                href={item.path}
              >
                {item.name}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default NavigationBar;
