import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const SidenavTopBox = ({ children, ...props }: BoxProps) => (
  <Box
    h="var(--header-height)"
    borderBottomWidth={1}
    borderBottomColor={useColorModeValue("gray.200", "blackAlpha.500")}
    {...props}
  >
    {children}
  </Box>
);

export default SidenavTopBox;
