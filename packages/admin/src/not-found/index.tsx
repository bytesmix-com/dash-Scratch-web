import { Center, Stack, Text } from "@chakra-ui/react";
import React from "react";

export const NotFound = () => (
  <Center w="100vw" h="100vh" bg="blue.50">
    <Stack align="center">
      <Text variant="heading-2">404 Not Found</Text>
      <Text>페이지를 찾을 수 없습니다.</Text>
    </Stack>
  </Center>
);
