import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { RegularPlaylistModel } from "admin/generated/api/react-query";
import { VideoGrid } from "admin/shared/components/video-grid";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ListCardProps {
  list: RegularPlaylistModel;
}
export const ListCard = ({ list }: ListCardProps) => {
  const navigate = useNavigate();
  return (
    <HStack
      align="flex-start"
      cursor="pointer"
      _hover={{ color: "blue.500" }}
      onClick={() =>
        navigate(`/dashboard/lecture-management/regular-playlist/${list.id}`)
      }
    >
      <Box minW="324px" flexShrink={0}>
        <VideoGrid
          thumbnails={list.thumbnails}
          length={list.videos.pageInfo?.countTotal as number}
        />
      </Box>
      <Stack px={5} py={6} spacing={1} flexShrink={1} wordBreak="break-all">
        <Text variant="heading-2">{list.name}</Text>
        <Text
          variant="body-1"
          maxW="400px"
          noOfLines={4}
          visibility="visible"
          whiteSpace="break-spaces"
        >
          {list.description}
        </Text>
      </Stack>
    </HStack>
  );
};
