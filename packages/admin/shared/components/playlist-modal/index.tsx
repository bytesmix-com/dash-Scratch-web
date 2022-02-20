/* eslint-disable no-unsafe-optional-chaining */
import {
  AspectRatio,
  Box,
  CircularProgress,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  GetRecommendedVideosByWeekDocument,
  PaginatedVideosDocument,
  useVideoQuery,
} from "admin/generated/api/react-query";
import { downloadFile } from "admin/shared/utils/download-file";
import { VideoModel } from "app/generated/api/react-query";
import { format } from "date-fns";
import _ from "lodash";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactPlayer from "react-player";
import { useInfiniteQuery } from "react-query";

import { VideoList } from "./video-list";

interface PlaylistModalProps {
  useDisclosureReturn: UseDisclosureReturn;
  regularWeekNumber?: number;
}

export const PlaylistModal = ({
  useDisclosureReturn,
  regularWeekNumber,
}: PlaylistModalProps) => {
  const { isOpen, onClose } = useDisclosureReturn;
  const { watch, setValue } = useFormContext();
  const [tabIndex, setTabIndex] = useState<number>(0);

  const { data: videoData, isLoading: isLoadingVideo } = useVideoQuery(
    client,
    {
      videoId: watch("videoIdPlayingOnModal"),
    },
    {
      queryKey: "GetVideoData",
      enabled: !!watch("videoIdPlayingOnModal"),
    },
  );

  const tabs = regularWeekNumber ? ["regular", "recommended"] : ["recommended"];

  const regularVideoList = useInfiniteQuery(
    ["videoList", tabIndex, regularWeekNumber],
    ({ pageParam = null }) =>
      client.request(PaginatedVideosDocument, {
        size: 10,
        page: pageParam,
        playlistFilter:
          tabs[tabIndex] === "regular" ? videoData?.video.playlist?.id : 1,
      }),
    {
      getNextPageParam: (lastData) => {
        return lastData?.paginatedVideos.pageInfo?.currentPage + 1;
      },
      enabled:
        tabs[tabIndex] === "regular" ? !!videoData?.video.playlist?.id : true,
    },
  );

  const recommendedVideoList = useInfiniteQuery(
    ["recommendedVideoList"],
    ({ pageParam = null }) =>
      client.request(GetRecommendedVideosByWeekDocument, {
        size: 10,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastData) => {
        return lastData?.recommendedPlaylist.videos.pageInfo?.currentPage + 1;
      },
    },
  );

  const isLoading =
    isLoadingVideo ||
    regularVideoList.isLoading ||
    recommendedVideoList.isLoading;

  const regularInfiniteResult = _.flatten(regularVideoList?.data?.pages).map(
    (page) => page.paginatedVideos,
  );
  const recommendedInfiniteResult = _.flatten(
    recommendedVideoList?.data?.pages,
  ).map((page) => page.recommendedPlaylist.videos);

  const regularVideos = regularInfiniteResult.reduce(
    (acc, curr) => [...acc, ...curr.nodes],
    [],
  ) as VideoModel[];
  const recommendedVideos = recommendedInfiniteResult.reduce(
    (acc, curr) => [...acc, ...curr.nodes],
    [],
  ) as VideoModel[];

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="1080px">
        <ModalHeader py={4} bg="neutral.50" roundedTop="md">
          <Text variant="body-1">재생목록</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={8}>
          <HStack spacing={6} align="flex-start">
            <Box flex={1}>
              <Skeleton isLoaded={!isLoading}>
                <AspectRatio ratio={16 / 9} w="full">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    controls
                    url={videoData?.video.video_url}
                  />
                </AspectRatio>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Text variant="heading-3" mt={6}>
                  {!videoData?.video.playlist
                    ? "추천 강의"
                    : `${videoData?.video.playlist?.week}주차`}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Text variant="heading-1" mt={1}>
                  {videoData?.video.title}
                </Text>
              </Skeleton>
              <Grid
                mt={2}
                columnGap={8}
                rowGap={1}
                templateColumns="repeat(2, 1fr)"
              >
                {[
                  { key: "URL", value: videoData?.video.video_url },
                  {
                    key: "최종수정일",
                    value: format(
                      new Date((videoData?.video.updatedAt ?? null) as number),
                      "yy.MM.dd",
                    ),
                  },
                  {
                    key: "공개",
                    value: (
                      <HStack spacing={0.5}>
                        <SvgIcon name="icon/public" boxSize="14px" />
                        <Text variant="body-3">
                          {!videoData?.video.playlist ||
                          videoData?.video.isPublic
                            ? "공개"
                            : "비공개"}
                        </Text>
                      </HStack>
                    ),
                  },
                  {
                    key: "최초작성일",
                    value: format(
                      new Date((videoData?.video.createdAt ?? null) as number),
                      "yy.MM.dd",
                    ),
                  },
                  ...(!videoData?.video.playlist
                    ? []
                    : [
                        {
                          key: "주차",
                          value: `${videoData.video.playlist.week}주차`,
                        },
                      ]),
                ].map((item) => (
                  <Skeleton isLoaded={!isLoading} key={item.key}>
                    <HStack>
                      <Text variant="body-4" color="neutral.500">
                        {item.key}
                      </Text>
                      <Box
                        fontSize="12px"
                        lineHeight="14px"
                        color="neutral.500"
                      >
                        {item.value}
                      </Box>
                    </HStack>
                  </Skeleton>
                ))}
              </Grid>
              <Stack spacing={0} mt={6}>
                {videoData?.video.files.map((file) => (
                  <HStack
                    spacing={1}
                    key={file.id}
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecor: "underline" }}
                    onClick={() => downloadFile(file.url, file.fileName)}
                  >
                    <SvgIcon boxSize={6} name="icon/download" />
                    <Text variant="body-2">{file.fileName}</Text>
                  </HStack>
                ))}
              </Stack>
              <Text variant="body-1" mt={6}>
                {videoData?.video.description}
              </Text>
            </Box>
            <Box
              w="216px"
              h="672.5px"
              rounded="6px"
              borderWidth={1}
              borderColor="neutral.200"
              overflow="hidden"
            >
              <HStack
                sx={{ ".chakra-text": { flex: 1, textAlign: "center" } }}
                spacing={0}
              >
                {tabs.map((item, index) => (
                  <Text
                    key={item}
                    bg={tabIndex === index ? "white" : "#DBDEE7"}
                    color={tabIndex === index ? "neutral.700" : "neutral.500"}
                    variant="button-s"
                    pb={11}
                    pt={13}
                    cursor="pointer"
                    onClick={() => {
                      setTabIndex(index);
                      regularVideoList.refetch();
                    }}
                  >
                    {item === "regular"
                      ? `${regularWeekNumber}주차`
                      : "추천 강의"}
                  </Text>
                ))}
              </HStack>
              <Stack
                p={4}
                pr={3}
                maxH="634px"
                overflowY="scroll"
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
                id="infinite-scroll-container"
              >
                {tabs[tabIndex] === "regular" ? (
                  <InfiniteScroll
                    dataLength={regularVideos?.length + 1}
                    next={() => regularVideoList.fetchNextPage()}
                    hasMore={
                      _.last(regularInfiniteResult)?.pageInfo?.hasNextPage ??
                      false
                    }
                    loader={
                      <CircularProgress isIndeterminate color="blue.300" />
                    }
                    scrollableTarget="infinite-scroll-container"
                  >
                    {regularVideos.map((video) => (
                      <VideoList
                        key={video.id}
                        video={video}
                        isLoading={isLoading}
                        currentTab={tabs[tabIndex]}
                        onClick={() =>
                          setValue("videoIdPlayingOnModal", video.id)
                        }
                      />
                    ))}
                  </InfiniteScroll>
                ) : (
                  <InfiniteScroll
                    dataLength={recommendedVideos?.length + 1}
                    next={() => recommendedVideoList.fetchNextPage()}
                    hasMore={
                      _.last(recommendedInfiniteResult)?.pageInfo
                        ?.hasNextPage ?? false
                    }
                    loader={
                      <CircularProgress isIndeterminate color="blue.300" />
                    }
                    scrollableTarget="infinite-scroll-container"
                  >
                    {recommendedVideos.map((video) => (
                      <VideoList
                        key={video.id}
                        video={video}
                        isLoading={isLoading}
                        currentTab={tabs[tabIndex]}
                        onClick={() =>
                          setValue("videoIdPlayingOnModal", video.id)
                        }
                      />
                    ))}
                  </InfiniteScroll>
                )}
              </Stack>
            </Box>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
