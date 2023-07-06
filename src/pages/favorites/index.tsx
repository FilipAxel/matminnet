import { Text } from "@nextui-org/react";

const Favorite = () => {
  return (
    <Text
      className="text-center"
      h1
      size={60}
      css={{
        textGradient: "45deg, $blue600 -20%, $pink600 50%",
      }}
      weight="bold"
    >
      Work in progress
    </Text>
  );
};

export default Favorite;
