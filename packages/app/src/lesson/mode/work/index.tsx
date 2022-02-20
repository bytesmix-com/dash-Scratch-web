import { AspectRatio, Box, IconButton, Text, Tooltip } from "@chakra-ui/react";
import client from "app/core/utils/api/client";
import {
  useGetModeVideosQuery,
  useMarkVideoProgressMutation,
  VideoModel,
} from "app/generated/api/react-query";
import { SpacerV } from "app/shared/components";
import React, { useState } from "react";
import { RiCloseFill, RiPauseFill, RiPlayFill } from "react-icons/ri";
import ReactPlayer from "react-player";
import { Rnd } from "react-rnd";

import { RecommendContents } from "../../components/recommend-contents";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  filter: "drop-shadow(0px 10px 23px rgba(0, 0, 0, 0.12))",
  borderRadius: "4px",
  zIndex: 99,
};

interface Props {
  videoId?: number;
  onExit?: () => void;
  url?: string;
  week: number;
  scratchUrl: string;
}

export const ModeWork = ({ week, videoId, onExit, scratchUrl, url }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const markProgress = useMarkVideoProgressMutation(client);
  const [hover, setHover] = useState(false);
  const { data: recommendedVideosResponse } = useGetModeVideosQuery(client, {
    filter: {
      week,
    },
  });
  const [playerUrl, setPlayerUrl] = useState(url);
  const [isRecommendVideoPlaying, setIsRecommendVideoPlaying] = useState(false);

  const recommendedVideos =
    recommendedVideosResponse?.recommendedPlaylist.videos.nodes;
  return (
    <Box pos="relative" minW={1024}>
      <Rnd
        style={style}
        default={{
          width: 400,
          height: 225,
          x: 0,
          y: 0,
        }}
        minWidth={400}
        minHeight={225}
        lockAspectRatio
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <Box
          w="full"
          pos="relative"
          style={{ aspectRatio: "16/9" }}
          sx={{
            iframe: {
              w: "100%",
              h: "100%",
            },
          }}
          _hover={{
            button: {
              color: "white !important",
            },
          }}
        >
          <ReactPlayer
            key={playerUrl}
            controls={false}
            playing={playing}
            onPlay={() => {
              setPlaying(true);
              setPlayCount(playCount + 1);
            }}
            onPause={() => setPlaying(false)}
            width="100%"
            height="100%"
            url={playerUrl}
            style={{
              pointerEvents: "none",
            }}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  controls: 0,
                  autohide: 1,
                  showinfo: 0,
                },
              },
            }}
            onProgress={(progress) =>
              markProgress.mutate({
                videoId: videoId as number,
                progress: progress.played * 100,
              })
            }
          />
          <IconButton
            id="button"
            aria-label="play"
            icon={playing ? <RiPauseFill /> : <RiPlayFill />}
            pos="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            onClick={() => setPlaying(!playing)}
            color="transparent"
            bg="transparent"
            _hover={{ bg: "whiteAlpha.100" }}
            fontSize="2xl"
          />
          <Tooltip label="작업모드 나가기" placement="top">
            <IconButton
              id="button"
              aria-label="close"
              icon={<RiCloseFill />}
              pos="absolute"
              right={0}
              top={0}
              onClick={onExit}
              color="transparent"
              bg="transparent"
              _hover={{ bg: "whiteAlpha.100" }}
              fontSize="2xl"
            />
          </Tooltip>
          {hover && (
            <Box
              bg="white"
              pos="absolute"
              bottom={0}
              left={0}
              w="full"
              p="5"
              transform="translateY(100%)"
            >
              {isRecommendVideoPlaying ? (
                <Text
                  cursor="pointer"
                  variant="heading-2"
                  color="blue.500"
                  onClick={() => {
                    setPlayerUrl(url);
                    setIsRecommendVideoPlaying(false);
                  }}
                >
                  &#60;&nbsp;추천 콘텐츠 나가기
                </Text>
              ) : (
                <>
                  <Text variant="heading-2" color="blue.500">
                    맞춤형 추천 콘텐츠
                  </Text>

                  <SpacerV h={4} />
                  <RecommendContents
                    videos={recommendedVideos as VideoModel[]}
                    mode="single-row"
                    clickMode="callback"
                    callback={(videoUrl) => {
                      setIsRecommendVideoPlaying(true);
                      setPlayerUrl(videoUrl);
                    }}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      </Rnd>
      <Box pointerEvents={isDragging || isResizing ? "none" : undefined}>
        <AspectRatio w="full" bg="gray.50" ratio={1024 / 640} minW={1024}>
          <iframe
            style={{ width: "100%", height: "100%" }}
            src={scratchUrl}
            title="scratch"
          />
        </AspectRatio>
      </Box>
    </Box>
  );
};
