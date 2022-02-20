/* eslint-disable react/jsx-one-expression-per-line */
import { Img, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  isDone: boolean;
  isSearched: boolean;
}

export const EmptyView = ({ isDone, isSearched }: Props) => {
  const getText = () => {
    if (isSearched) {
      return "일치하는";
    }
    return !isDone ? "새로운" : "처리한";
  };
  return (
    <Stack align="center" pt={20} spacing={10}>
      <Img
        h="200px"
        src={`https://media-cdn.branch.so/01FTANKD0R8870M1ZVJMBWF2KB/student-${
          !isDone ? "F" : "M"
        }.svg`}
      />
      <Text textAlign="center" variant="heading-2" color="blue.400">
        {getText()} 요청이
        <br />
        없습니다.
      </Text>
    </Stack>
  );
};
