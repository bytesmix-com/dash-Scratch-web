import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

const SidenavBottomBox = ({ children, ...props }: BoxProps) => (
  <Box
    bg="blackAlpha.300"
    borderTopWidth={1}
    borderColor="whiteAlpha.200"
    pos="absolute"
    bottom={0}
    left={0}
    w="full"
    h="var(--sidenav-bottom-height)"
    {...props}
  >
    {children}
  </Box>
);

export default SidenavBottomBox;
