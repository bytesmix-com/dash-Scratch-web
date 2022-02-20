import { Box, HStack, Text } from "@chakra-ui/react";
import { ProcessBadge, SpacerV } from "app/shared/components";
import { format } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";

interface OtherLessonCardProps {
  index: number;
  title: string;
  length: number;
  process: number;
  videoId: number;
}

export const OtherLessonCard = ({
  index,
  title,
  length,
  process,
  videoId,
}: OtherLessonCardProps) => {
  const navigate = useNavigate();
  return (
    <Box
      _hover={{ cursor: "pointer", background: "rgba(0,0,0,0.1)" }}
      onClick={() => navigate(`/lesson/${videoId}`)}
    >
      <SpacerV h="0.5px" bg="neutral.200" />
      <HStack py={4} spacing={0}>
        <Text variant="body-1" pl={4} w={12}>
          {index + 1}
        </Text>
        <Text variant="body-2" pl={4} w="168px">
          {title}
        </Text>
        <Text variant="body-1" pl="22px" w="72px">
          {format(length * 1000, "mm:ss")}
        </Text>
        <ProcessBadge process={process} />
      </HStack>
    </Box>
  );
};
