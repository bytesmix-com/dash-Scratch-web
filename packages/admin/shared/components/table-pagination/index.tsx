import { Center } from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import React, { ComponentProps } from "react";

export const TablePagination = ({
  ...props
}: ComponentProps<typeof Pagination>) => (
  <Center pt="8" maxW="full" minW={0}>
    <Pagination
      defaultCurrent={5}
      total={500}
      paginationProps={{ display: "flex" }}
      pageNeighbours={1}
      baseStyles={{
        fontSize: "sm",
        bg: "transparent",
        px: 2,
        color: "neutral.200",
        fontWeight: "semibold",
      }}
      activeStyles={{
        bg: "blue.500",
        color: "white",
      }}
      hoverStyles={{
        bg: "blue.50",
      }}
      {...props}
    />
  </Center>
);

export default TablePagination;
