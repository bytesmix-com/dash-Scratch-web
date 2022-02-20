import { AspectRatio, Box, HStack, Stack, Text } from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import {
  useGetModeVideosQuery,
  useGetVideosByWeekQuery,
  useMarkVideoProgressMutation,
  VideoModel,
} from "app/generated/api/react-query";
import { ContentCard, SpacerH, SpacerV } from "app/shared/components";
import _ from "lodash";
import React, { useState } from "react";
import ReactPlayer from "react-player";

import { OtherLessons } from "../../components/other-lessons";

interface ModeProps {
  week: number;
  url: string;
  videoId?: number;
  scratchUrl: string;
}

export const ModeHorizon = ({ week, url, scratchUrl, videoId }: ModeProps) => {
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

  const [currentPlayingRecommendVideoUrl, setCurrentPlayingRecommendVideoUrl] =
    useState<string | undefined>(undefined);
  return (
    <Box>
      <HStack h="463px" justify="space-between" spacing={4}>
        <Box bg="gray.200" boxSize="full">
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
        <SpacerH w="1px" bg="neutral.300" />

        {currentPlayingRecommendVideoUrl ? (
          <Box flexShrink={0} w="584px" alignSelf="flex-start" height="100%">
            <Text
              cursor="pointer"
              variant="heading-2"
              color="blue.500"
              onClick={() => {
                setCurrentPlayingRecommendVideoUrl(undefined);
              }}
            >
              &#60;&nbsp;추천 콘텐츠 나가기
            </Text>
            <SpacerV h={4} />
            <ReactPlayer
              width="100%"
              height="calc(100% - 38px)"
              url={currentPlayingRecommendVideoUrl}
              controls
            />
          </Box>
        ) : (
          <>
            {!_.isEmpty(otherVideos) && !otherVideosIsLoading && (
              <Stack h="full" w="344px" spacing={0} pt={2}>
                <Text variant="heading-2" color="blue.500">
                  {week}
                  주차 다른 강의
                </Text>

                <SpacerV h={4} />

                <OtherLessons
                  videos={otherVideos as VideoModel[]}
                  maxH="384px"
                  w="344px"
                />
              </Stack>
            )}

            {!_.isEmpty(recommendedVideos) && !recommendedVideosIsLoading && (
              <Stack h="full" w="224px" minW="224px">
                <Text variant="heading-2" color="blue.500">
                  맞춤형 추천 콘텐츠
                </Text>

                <SpacerV h={4} />

                <Stack overflow="scroll" spacing={4}>
                  {recommendedVideos?.map((video) => (
                    <ContentCard
                      key={video.id}
                      videoId={video.id}
                      title={video.title}
                      length={1000}
                      img={video.video_thumbnail as string}
                      h="125px"
                      onVideoClick={(videoUrl) =>
                        setCurrentPlayingRecommendVideoUrl(videoUrl)
                      }
                    />
                  ))}
                </Stack>
              </Stack>
            )}
          </>
        )}
      </HStack>
      <SpacerV h={4} />
      <AspectRatio w="full" bg="gray.50" ratio={1024 / 640} minW={1024}>
        <iframe
          style={{ width: "100%", height: "100%" }}
          src={scratchUrl}
          title="scratch"
        />
      </AspectRatio>
      <SpacerV h={10} />
    </Box>
  );
};
