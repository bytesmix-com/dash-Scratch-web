import { Box, Img, Skeleton, Stack, StackProps, Text } from "@chakra-ui/react";
import { VideoModel } from "admin/generated/api/react-query";
import { formatVideoLength } from "admin/shared/utils/format-video-length";
import React from "react";

interface VideoListProps extends StackProps {
  video: VideoModel;
  isLoading: boolean;
  currentTab: string;
}

export const VideoList = ({
  video,
  isLoading,
  currentTab,
  ...rest
}: VideoListProps) => {
  return (
    <Stack key={video.id} spacing={0} pb={4} cursor="pointer" {...rest}>
      <Box pos="relative">
        <Img
          w="full"
          h="103.5px"
          borderWidth={1}
          borderColor="neutral.50"
          src={video.video_thumbnail ?? ""}
          objectFit="cover"
        />
        <Text variant="body-3" pos="absolute" right="10px" bottom="10px">
          {formatVideoLength(video.video_lengthInSeconds)}
        </Text>
      </Box>
      <Skeleton isLoaded={!isLoading}>
        <Text pt={2} variant="body-2" noOfLines={2}>
          {video.title}
        </Text>
      </Skeleton>
      <Skeleton isLoaded={!isLoading}>
        <Text pt={0.5} variant="body-1">
          {currentTab === "regular"
            ? `${video.playlist?.week ?? "-"}주차 강의`
            : "추천 강의"}
        </Text>
      </Skeleton>
    </Stack>
  );
};
