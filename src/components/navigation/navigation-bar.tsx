/* eslint-disable react/jsx-no-undef */
import { Navbar, Dropdown, Avatar, Text, Link } from "@nextui-org/react";

import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import { useRouter } from "next/router";

type Key = string | number;

const NavigationBar = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (!sessionData) return;

  const collapseItems = [
    { name: "Catalog", path: "/" },
    { name: "Recipes", path: "/recipes" },
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
          Name of Page
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
        <Navbar.Link isActive={router.pathname === "/recipes"} href="/recipes">
          Recipes
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
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                className="cursor-pointer"
                bordered
                color="secondary"
                src={sessionData?.user?.image as string}
                text={sessionData?.user?.name as string}
                size="md"
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            color="secondary"
            aria-label="Avatar Actions"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onAction={handleDropDownAction}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {sessionData?.user?.email}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item withDivider key="settings" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Settings
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              key="logout"
              color="error"
              withDivider
              icon={<MdOutlineLogout size={22} fill="currentColor" />}
            >
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
  );
};
export default NavigationBar;
