import { Box, BoxProps, Progress } from "@chakra-ui/react";
import React from "react";

interface TableShellProps extends BoxProps {
  isLoading?: boolean;
}

export const TableShell = ({
  children,
  isLoading,
  ...props
}: TableShellProps) => (
  <Box
    w="full"
    overflowX="auto"
    sx={{
      "&::-webkit-scrollbar-track": {
        bg: "transparent",
      },
      "&::-webkit-scrollbar": {
        height: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        bg: "blackAlpha.200",
        borderRadius: "20px",
      },
    }}
    {...props}
  >
    {isLoading ? (
      <Progress size="xs" isIndeterminate colorScheme="blue" />
    ) : (
      children
    )}
  </Box>
);

export default TableShell;
