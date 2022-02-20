import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { fonts } from "./fonts";
import { space } from "./space";
import { styles } from "./styles";
import { Button } from "./variants/button";
import { Card } from "./variants/card";
import { Text } from "./variants/text";

const customTheme = {
  colors,
  fonts,
  styles,
  space,
  components: {
    Card,
    Button,
    Text,
  },
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme(customTheme);

export default theme;
