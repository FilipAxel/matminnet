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
import { MdLogout } from "react-icons/md";

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
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Recipes", path: "/recipes" },
    { name: "Discover", path: "/discover" },
    { name: "My Settings", path: "/settings" },
  ];

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-sans font-bold text-inherit">
            MatMinnet
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={router.pathname === "/"}>
          <Link className="font-sans" color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === "/collections"}>
          <Link className="font-sans" color="foreground" href="/collections">
            Collections
          </Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === "/recipes"}>
          <Link
            className="font-sans"
            color="foreground"
            href="/recipes"
            aria-current="page"
          >
            Recipes
          </Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === "/discover"}>
          <Link className="font-sans" color="foreground" href="/discover">
            Discover
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
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session?.user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
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
                  Logout
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
              variant="flat"
              onClick={() => void void signIn()}
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onClick={() => void void signIn()}
              color="primary"
              variant="flat"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color="foreground"
              className="my-2 w-full font-sans"
              href={item.path}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default NavigationBar;
