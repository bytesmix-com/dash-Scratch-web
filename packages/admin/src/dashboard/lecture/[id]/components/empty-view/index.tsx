import { Box, Button, Img, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const EmptyView = () => {
  const navigate = useNavigate();
  return (
    <Stack align="center" shouldWrapChildren pt={5} pb={7} spacing={0}>
      <Img
        src="https://media-cdn.branch.so/01FTANKD0R8870M1ZVJMBWF2KB/empty_list.svg"
        boxSize="200px"
      />
      <Box h={10} />
      <Text variant="heading-2" color="blue.400">
        정규강의 재생목록이 없습니다.
      </Text>
      <Box h={4} />
      <Button
        colorScheme="blue"
        onClick={() =>
          navigate("/dashboard/lecture-management/regular-playlist")
        }
      >
        재생목록 추가하기
      </Button>
    </Stack>
  );
};
