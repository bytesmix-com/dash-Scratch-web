import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import {
  useGetModeVideosQuery,
  useGetVideosByWeekQuery,
  useMarkVideoProgressMutation,
  VideoModel,
} from "app/generated/api/react-query";
import { SpacerV } from "app/shared/components";
import _ from "lodash";
import React from "react";
import ReactPlayer from "react-player";

import { OtherLessons } from "../../components/other-lessons";
import { RecommendContents } from "../../components/recommend-contents";

interface ModeProps {
  week: number;
  url: string;
  videoId?: number;
  scratchUrl: string;
}

export const ModeVertical = ({ week, url, videoId, scratchUrl }: ModeProps) => {
  const { data: otherVideosResponse, isLoading: otherVideosIsLoading } =
    useGetVideosByWeekQuery(
      client,
      {
        week: week as number,
      },
      {
        enabled: !!week,
      },
    );

  const otherVideos = otherVideosResponse?.regularPlaylistByWeek.videos.nodes;

  const {
    data: recommendedVideosResponse,
    isLoading: recommendedVideosIsLoading,
  } = useGetModeVideosQuery(client, {
    filter: {
      week,
    },
  });
  const markProgress = useMarkVideoProgressMutation(client);

  const recommendedVideos =
    recommendedVideosResponse?.recommendedPlaylist.videos.nodes;

  return (
    <Box pb="10">
      <HStack h="full" align="flex-start" justify="space-between" d="table">
        <Stack w="384px" spacing={0} d="table-cell" verticalAlign="top">
          <Box bg="gray.50" w="full" h="216px">
            <ReactPlayer
              width="100%"
              height="100%"
              url={url}
              controls
              onProgress={(progress) =>
                markProgress.mutate({
                  videoId: videoId as number,
                  progress: progress.played * 100,
                })
              }
            />
          </Box>

          <SpacerV h={6} />

          {!_.isEmpty(otherVideos) && !otherVideosIsLoading && (
            <>
              <Text variant="heading-2" color="blue.500">
                {week}
                주차 다른 강의
              </Text>
              <SpacerV h={4} />

              <OtherLessons videos={otherVideos as VideoModel[]} maxH="320px" />

              <SpacerV h={6} />
            </>
          )}

          {!recommendedVideosIsLoading && (
            <>
              <Text variant="heading-2" color="blue.500">
                맞춤형 추천 콘텐츠
              </Text>

              <SpacerV h={4} />

              <RecommendContents
                videos={recommendedVideos as VideoModel[]}
                clickMode="direct"
              />
            </>
          )}
        </Stack>
        <Box
          pl="4"
          backgroundColor="white"
          w="full"
          minW={1024}
          d="table-cell"
          verticalAlign="top"
        >
          <iframe
            style={{ width: "100%", height: "100%" }}
            src={scratchUrl}
            title="scratch"
          />
        </Box>
      </HStack>
    </Box>
  );
};
