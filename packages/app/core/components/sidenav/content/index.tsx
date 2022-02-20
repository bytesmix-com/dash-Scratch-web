import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const SidenavContent = ({ children, ...props }: BoxProps) => (
  <Box
    maxH="calc(100vh - var(--header-height) - var(--sidenav-bottom-height))"
    overflowY="auto"
    overflowX="hidden"
    sx={{
      "&::-webkit-scrollbar-track": {
        bg: "transparent",
      },
      "&::-webkit-scrollbar": {
        width: 1.5,
      },
      "&::-webkit-scrollbar-thumb": {
        bg: useColorModeValue("gray.100", "whiteAlpha.200"),
        rounded: "full",
      },
    }}
    {...props}
  >
    {children}
  </Box>
);

export default SidenavContent;
