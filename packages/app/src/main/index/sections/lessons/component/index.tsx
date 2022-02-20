import { Box, HStack, Img, Stack, Text } from "@chakra-ui/react";
import { VideoModel } from "app/generated/api/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

interface BarProps {
  title: string;
  percent: number;
}
export const PercentBar = ({ title, percent }: BarProps) => {
  const getPercent = () => {
    if (percent >= 95) {
      return 100;
    }
    return percent;
  };
  return (
    <HStack>
      <Text variant="body-2" minW="72px">
        {title}
      </Text>
      <HStack h={6} w="full" spacing={0} borderRadius={50} overflow="clip">
        <Box bg="blue.500" h="full" w={`${getPercent()}%`} />
        <Box bg="blue.100" h="full" w={`${100 - getPercent()}%`} />
      </HStack>

      <HStack spacing={0} minW={10}>
        <Text variant="heading-3" color="blue.500">
          {getPercent()}
        </Text>
        <Text variant="heading-3" color="blue.500">
          %
        </Text>
      </HStack>
    </HStack>
  );
};

interface VideoCardProps {
  video: VideoModel;
}
export const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();
  return (
    <HStack
      spacing={6}
      cursor="pointer"
      _hover={{ color: "blue.500" }}
      onClick={() => navigate(`/lesson/${video.id}`)}
    >
      <Img
        flexShrink={0}
        w="160px"
        h="80px"
        src={video.video_thumbnail as string}
        objectFit="cover"
      />
      <Stack spacing={1} w="500px">
        <Text variant="heading-3" isTruncated>
          {video.title}
        </Text>
        <Text variant="body-3" isTruncated noOfLines={2}>
          {video.description}
        </Text>
      </Stack>
    </HStack>
  );
};
