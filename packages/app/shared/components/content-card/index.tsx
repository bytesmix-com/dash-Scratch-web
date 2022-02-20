import {
  AspectRatio,
  Box,
  Grid,
  HStack,
  Img,
  ImgProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import { useGetRecommendVideoQuery } from "app/generated/api/react-query";
import { format } from "date-fns";
import React, { ComponentProps } from "react";
import ReactPlayer from "react-player";

import { SpacerV } from "..";

interface ContentCardProps extends ImgProps {
  videoId: number;
  title: string;
  img: string;
  length: number;
  boxProps?: ComponentProps<typeof Box>;
  onVideoClick?: (url: string) => void;
}

export const ContentCard = ({
  videoId,
  title,
  img,
  length,
  boxProps,
  onVideoClick,
  ...rest
}: ContentCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: videoData, isLoading } = useGetRecommendVideoQuery(
    client,
    {
      videoId: videoId as number,
    },
    // {
    //   enabled: !!watch("videoIdPlayingOnModal"),
    // },
  );

  return (
    <>
      <Box {...boxProps}>
        <Stack spacing="-22px" align="flex-end">
          <AspectRatio ratio={16 / 9} w="full">
            <Img
              src={img}
              bg="gray.50"
              w="full"
              h="full"
              // h="104px"
              _hover={{ cursor: "pointer" }}
              onClick={
                onVideoClick
                  ? () => onVideoClick(videoData?.video.video_url as string)
                  : onOpen
              }
              objectFit="cover"
              {...rest}
            />
          </AspectRatio>
          <Text variant="body-3" color="neutral.800" pr="10px" mt="-10px">
            {format(length, "mm:ss")}
          </Text>
        </Stack>
        <SpacerV h={4} />
        <Text variant="body-2" maxW="184px" noOfLines={2} h={8}>
          {title}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="1080px">
          <ModalHeader py={4} bg="neutral.50" roundedTop="md">
            <Text variant="body-1">추천 강의</Text>
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
                        new Date(
                          (videoData?.video.updatedAt ?? null) as number,
                        ),
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
                        new Date(
                          (videoData?.video.createdAt ?? null) as number,
                        ),
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
                <Text variant="body-1" mt={6}>
                  {videoData?.video.description}
                </Text>
              </Box>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
