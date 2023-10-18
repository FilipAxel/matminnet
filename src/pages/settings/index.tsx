import { Card, CardBody } from "@nextui-org/react";
import {
  MdKeyboardArrowRight,
  MdOutlineMenuBook,
  MdSettings,
} from "react-icons/md";
import cn from "classnames";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
      <div className="container mt-4 flex flex-wrap justify-center gap-5">
        {SettingsList.map((setting, index) => (
          <div className="mx-8 w-full" key={index}>
            <Link color="primary" href={`/settings/${setting?.path}`}>
              <Card isPressable className="max-h-96 w-full max-w-sm">
                <CardBody className="flex flex-row items-center justify-between">
                  <h2 className="flex items-center">
                    {setting.icon && (
                      <div className={cn(`mr-2 text-xl`, ...setting.styles)}>
                        <setting.icon />
                      </div>
                    )}
                    {setting.name}
                  </h2>
                  <MdKeyboardArrowRight className="text-xl" />
                </CardBody>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    );
  }
};

export default Settings;
