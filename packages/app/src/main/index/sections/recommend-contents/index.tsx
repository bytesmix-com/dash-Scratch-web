/* eslint-disable no-nested-ternary */
import { Box, Button, ButtonProps, HStack, Text } from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import { useRecommendedVideosQuery } from "app/generated/api/react-query";
import { ContentCard, SpacerV } from "app/shared/components";
import _ from "lodash";
import Carousel from "nuka-carousel";
import React from "react";

interface ArrowButtonProps extends ButtonProps {
  direction: string;
}

export const ArrowButton = ({ direction, ...rest }: ArrowButtonProps) => {
  return (
    <Button
      size="sx"
      p={0}
      boxSize="32px"
      variant="unstyled"
      bg="white"
      shadow="xl"
      {...rest}
    >
      <SvgIcon boxSize="full" name={`icon/chevron_${direction}`} />
    </Button>
  );
};

export const MainRecommendContents = () => {
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const data = useRecommendedVideosQuery(client, {
    size: 20,
  });

  const videos = data.data?.recommendedPlaylist.videos.nodes;

  const hasNextPage = (videoLength: number) => {
    if (videoLength <= 6) {
      return false;
    }
    if (carouselIndex > videoLength / 6) {
      return false;
    }
    return true;
  };

  return (
    <Box py={8} bg="white" shadow="md" w="100%" maxW="1440px">
      <Text px={8} variant="heading-1" color="blue.500">
        맞춤형 콘텐츠 추천
      </Text>

      <SpacerV h={4} />
      <HStack
        justify="space-between"
        spacing={3}
        w="full"
        pos="relative"
        ml="8px"
        px="24px"
      >
        {data.isLoading ? (
          <Box boxSize="144px" />
        ) : _.isEmpty(videos) ? (
          <Text variant="body-3">표시할 추천 콘텐츠가 없습니다.</Text>
        ) : (
          <Carousel
            slideIndex={carouselIndex}
            slidesToShow={6}
            withoutControls
            dragging={false}
          >
            {videos?.map((video) => (
              <ContentCard
                key={video.id}
                videoId={video.id}
                title={video.title}
                img={video.video_thumbnail as string}
                length={video.video_lengthInSeconds}
                boxProps={{ mr: "16px" }}
              />
            ))}
          </Carousel>
        )}
      </HStack>
      {!data.isLoading && !_.isEmpty(videos) && (
        <>
          <HStack
            justify="space-between"
            spacing={0}
            w="full"
            mt="-106px"
            px={8}
          >
            <ArrowButton
              direction="left"
              onClick={() => setCarouselIndex(carouselIndex - 6)}
              disabled={carouselIndex === 0}
            />
            <ArrowButton
              direction="right"
              onClick={() => setCarouselIndex(carouselIndex + 6)}
              disabled={!hasNextPage(videos?.length as number)}
            />
          </HStack>
          <Box boxSize="76px" />
        </>
      )}
    </Box>
  );
};
