import { Avatar, Dropdown, Grid, Text } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";

type Key = string | number;
const Navigation = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return;

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
      default:
        break;
    }
  };
  return (
    <Grid className="mr-4 mt-4 flex items-center justify-end">
      <Text className="mr-2">Welcome {sessionData?.user?.name as string}</Text>

      <Dropdown placement="bottom-left">
        <Dropdown.Trigger>
          <Avatar
            className="cursor-pointer"
            src={sessionData?.user?.image as string}
            text={sessionData?.user?.name as string}
            size="md"
          />
        </Dropdown.Trigger>
        <Dropdown.Menu
          disabledKeys={["profile"]}
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
    </Grid>
  );
};

export default Navigation;
