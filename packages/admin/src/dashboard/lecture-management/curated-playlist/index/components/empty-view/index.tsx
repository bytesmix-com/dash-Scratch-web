import { Img, Stack, Text } from "@chakra-ui/react";
import React from "react";

export const EmptyView = () => (
  <Stack align="center" pt={20} spacing={10}>
    <Img
      w="200px"
      src="https://media-cdn.branch.so/01FTANKD0R8870M1ZVJMBWF2KB/empty_contents.svg"
    />
    <Text textAlign="center" variant="heading-2" color="blue.400">
      업로드된 강의가
      <br />
      없습니다.
    </Text>
  </Stack>
);
