import { Card, Grid, Text } from "@nextui-org/react";
import SettingsTable from "~/components/table/table";
import {
  MdKeyboardArrowRight,
  MdOutlineMenuBook,
  MdSettings,
} from "react-icons/md";
import cn from "classnames";
import Link from "next/link";

interface Setting {
  name: string;
  icon: React.ComponentType;
  path: string;
  styles: string[];
}

const Settings = () => {
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
  ];

  return (
    <>
      {/* <SettingsTable /> */}

      <Grid.Container className="mt-4" gap={1} justify="center">
        {SettingsList.map((setting, index) => (
          <Grid xs={11} key={index}>
            <Card isPressable css={{ mw: "400px" }} variant="flat">
              <Card.Body className="flex flex-row items-center justify-between">
                <Link color="primary" href={`/settings/${setting?.path}`}>
                  <Text className="flex items-center" weight="normal" h2>
                    {setting.icon && (
                      <div className={cn(`mr-2 text-xl`, ...setting.styles)}>
                        <setting.icon />
                      </div>
                    )}
                    {setting.name}
                  </Text>
                </Link>

                <MdKeyboardArrowRight className="text-xl" />
              </Card.Body>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </>
  );
};

export default Settings;
