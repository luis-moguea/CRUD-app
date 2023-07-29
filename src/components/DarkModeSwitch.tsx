import { Switch, useColorMode } from "@chakra-ui/react";

const DarkModeSwitch = () => {
  const { toggleColorMode } = useColorMode();

  return <Switch onChange={toggleColorMode}></Switch>;
};

export default DarkModeSwitch;
