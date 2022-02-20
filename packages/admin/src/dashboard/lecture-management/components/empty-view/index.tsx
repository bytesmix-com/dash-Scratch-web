import { Box, Img, Stack, Text } from "@chakra-ui/react";
import React from "react";

export const EmptyView = () => {
  return (
    <Stack align="center" shouldWrapChildren pt={5} pb={7} spacing={0}>
      <Img
        src="https://media-cdn.branch.so/01FTANKD0R8870M1ZVJMBWF2KB/empty-list-grey.svg"
        boxSize="200px"
      />
      <Box h={10} />
      <Text variant="heading-2" color="blue.400" textAlign="center">
        정규강의 재생목록이
        <br />
        없습니다.
      </Text>
      <Box h={4} />
    </Stack>
  );
};
