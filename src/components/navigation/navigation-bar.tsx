/* eslint-disable react/jsx-no-undef */
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownMenu,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
  DropdownSection,
  cn,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdLogout, MdHome, MdMenuBook, MdOutlineSearch } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { SiBookstack } from "react-icons/si";

type Key = string | number;

const NavigationBar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";
  const router = useRouter();

  const handleDropDownAction = (option: Key) => {
    switch (option) {
      case "logout":
        try {
          void signOut();
        } catch (error) {
          console.warn(error);
          throw error;
        }
        break;
      case "settings":
        void router.push("/settings").catch((error) => {
          console.warn(error);
          throw error;
        });
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      name: "Hem",
      path: "/",
      public: true,
      icon: <MdHome className="text-2xl" />,
    },
    {
      name: "Upptäck",
      path: "/discover",
      public: true,
      icon: <MdOutlineSearch className="text-2xl" />,
    },
    {
      name: "Skapa",
      path: "/recipes/create",
      public: session?.user?.id ? true : false,
      icon: <IoIosAddCircleOutline className="text-2xl" />,
    },
    {
      name: "Recept",
      path: "/recipes",
      public: session?.user?.id ? true : false,
      icon: <MdMenuBook className="text-2xl" />,
    },

    {
      name: "kokböcker",
      path: "/collections",
      public: session?.user?.id ? true : false,
      icon: <SiBookstack className="text-2xl" />,
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            MatMinnet
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {session?.user?.id && (
          <NavbarItem isActive={router.pathname === "/recipes/create"}>
            <Link color="foreground" href="/recipes/create" aria-current="page">
              Skapa
            </Link>
          </NavbarItem>
        )}
        {session?.user?.id && (
          <NavbarItem isActive={router.pathname === "/collections"}>
            <Link color="foreground" href="/collections">
              kokböcker
            </Link>
          </NavbarItem>
        )}

        {session?.user?.id && (
          <NavbarItem isActive={router.pathname === "/recipes"}>
            <Link color="foreground" href="/recipes" aria-current="page">
              Recept
            </Link>
          </NavbarItem>
        )}

        <NavbarItem isActive={router.pathname === "/discover"}>
          <Link color="foreground" href="/discover">
            Upptäck
          </Link>
        </NavbarItem>
      </NavbarContent>

      {status === "authenticated" || status === "loading" ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name=""
                size="sm"
                src={session?.user.image || ""}
              />
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => handleDropDownAction(key)}
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownSection>
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Inloggad som</p>
                  <p className="font-semibold">{session?.user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">Mina inställningar</DropdownItem>
              </DropdownSection>

              <DropdownSection>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <MdLogout className={cn(iconClasses, "text-red-500")} />
                  }
                >
                  Logga ut
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button
              color="primary"
              variant="light"
              onClick={() => void void signIn()}
            >
              Logga in
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onClick={() => void void signIn()}
              color="primary"
              variant="bordered"
            >
              Skapa konto
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map(
          (item, index) =>
            item.public && (
              <NavbarMenuItem
                className="flex items-center gap-2"
                key={`${item.name}-${index}`}
              >
                {item.icon}
                <Link
                  color="foreground"
                  className="my-2 w-full  "
                  href={item.path}
                  size="lg"
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            )
        )}
      </NavbarMenu>
    </Navbar>
  );
};
export default NavigationBar;
