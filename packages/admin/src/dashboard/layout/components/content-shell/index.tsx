import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export const DashboardLayoutContentShell = ({ ...props }: BoxProps) => (
  <Box minH="calc(100vh - 306px)" flex={1} {...props} />
);
