import {
  Box,
  Grid,
  GridItem,
  GridProps,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { VideoModel } from "app/generated/api/react-query";
import { ContentCard } from "app/shared/components";
import _ from "lodash";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import ReactPlayer from "react-player";

interface RecommendContentsProps extends GridProps {
  videos: VideoModel[];
  mode?: "single-row" | "default";
  clickMode?: "modal" | "direct" | "callback";
  callback?: (url: string) => void;
}

export const RecommendContents = ({
  videos,
  mode = "default",
  clickMode = "modal",
  callback,
  ...rest
}: RecommendContentsProps) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  if (videoUrl) {
    return (
      <Box h="216px" pos="relative">
        <ReactPlayer
          width="100%"
          height="100%"
          url={videoUrl}
          controls
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                controls: 1,
                autohide: 1,
                showinfo: 0,
              },
            },
          }}
        />
        <Tooltip label="목록으로 나가기" placement="top">
          <IconButton
            id="button"
            aria-label="close"
            icon={<RiCloseFill color="black" />}
            pos="absolute"
            right={0}
            top={0}
            onClick={() => setVideoUrl(undefined)}
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            fontSize="2xl"
          />
        </Tooltip>
      </Box>
    );
  }
  const onVideoClick = (url: string) => {
    if (clickMode === "direct") {
      return setVideoUrl(url);
    }
    if (clickMode === "callback") {
      return callback && callback(url);
    }
    return undefined;
  };
  return (
    <Grid
      overflow="scroll"
      maxH={72}
      templateRows={mode === "default" ? "repeat(1, 1fr)" : "none"}
      templateColumns={mode === "default" ? "repeat(2, 1fr)" : "repeat(4, 1fr)"}
      gap={4}
      {...rest}
    >
      {_.isEmpty(videos) && (
        <Text variant="body-3">표시할 추천 콘텐츠가 없습니다.</Text>
      )}
      {videos?.map((video) => (
        <GridItem key={video.id}>
          <ContentCard
            videoId={video.id}
            title={video.title}
            length={1000}
            img={video.video_thumbnail as string}
            onVideoClick={(url) => onVideoClick(url)}
          />
        </GridItem>
      ))}
    </Grid>
  );
};
