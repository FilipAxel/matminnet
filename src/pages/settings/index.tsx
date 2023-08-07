import { Card, Grid, Text } from "@nextui-org/react";
import {
  MdKeyboardArrowRight,
  MdOutlineMenuBook,
  MdSettings,
} from "react-icons/md";
import cn from "classnames";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginActionDialog from "~/components/dialog/login-action-dialog";
import { useRouter } from "next/router";

interface Setting {
  name: string;
  icon: React.ComponentType;
  path: string;
  styles: string[];
}

const Settings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated" && !session) {
    void router.push("/404");
  }
  // Get the isAdmin value from the session data
  const isAdmin = session?.user?.isAdmin;

  const SettingsList: Setting[] = [
    {
      name: "Recipes Management",
      icon: MdOutlineMenuBook,
      path: "managment",
      styles: ["text-purple-700"],
    },
    {
      name: "Account Settings",
      icon: MdSettings,
      path: "account",
      styles: ["text-blue-500"],
    },
    isAdmin && {
      name: "Admin",
      icon: MdSettings,
      path: "admin",
      styles: ["text-red-500"],
    },
  ].filter(Boolean) as Setting[];

  if (status !== "loading") {
    return (
      <Grid.Container className="mt-4" gap={1} justify="center">
        {SettingsList.map((setting, index) => (
          <Grid xs={11} key={index}>
            <Link
              className="w-full"
              color="primary"
              href={`/settings/${setting?.path}`}
            >
              <Card isPressable css={{ mw: "400px" }} variant="flat">
                <Card.Body className="flex flex-row items-center justify-between">
                  <Text className="flex items-center" weight="normal" h2>
                    {setting.icon && (
                      <div className={cn(`mr-2 text-xl`, ...setting.styles)}>
                        <setting.icon />
                      </div>
                    )}
                    {setting.name}
                  </Text>
                  <MdKeyboardArrowRight className="text-xl" />
                </Card.Body>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid.Container>
    );
  }
};

export default Settings;
