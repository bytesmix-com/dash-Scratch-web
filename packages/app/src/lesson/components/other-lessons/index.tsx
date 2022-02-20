import { Box, BoxProps, HStack, Text } from "@chakra-ui/react";
import { VideoModel } from "app/generated/api/react-query";
import { SpacerH } from "app/shared/components";
import React from "react";

import { OtherLessonCard } from "../other-lesson-card";

interface OtherLessonsProps extends BoxProps {
  videos: VideoModel[];
}

export const OtherLessons = ({ videos, ...rest }: OtherLessonsProps) => {
  return (
    <>
      <Box {...rest}>
        <HStack bg="neutral.100" py="9px" pl={16} spacing={0}>
          <Text variant="body-4">내용</Text>
          <SpacerH w="153.5px" />
          <Text variant="body-4">길이</Text>
        </HStack>
      </Box>
      <Box
        overflow="scroll"
        sx={{
          "&::-webkit-scrollbar-track": {
            bg: "transparent",
          },
          "&::-webkit-scrollbar": {
            height: "8px",
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            bg: "blackAlpha.200",
            borderRadius: "20px",
          },
        }}
        {...rest}
      >
        {videos?.map((video, i) => (
          <OtherLessonCard
            key={video.id}
            videoId={video.id}
            index={i}
            title={video.title}
            length={video.video_lengthInSeconds}
            process={video.progress as number}
          />
        ))}
      </Box>
    </>
  );
};
