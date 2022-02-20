/* eslint-disable react/jsx-one-expression-per-line */
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import {
  useExistingRegularPlaylistWeeksQuery,
  useGetVideosByWeekQuery,
  VideoModel,
} from "app/generated/api/react-query";
import { first } from "lodash";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChangeLessonProps {
  currentWeek: number | undefined;
}

export const ChangeLesson = ({ currentWeek }: ChangeLessonProps) => {
  const navigate = useNavigate();

  const [week, setWeek] = React.useState(0);
  const [video, setVideo] = React.useState<Partial<VideoModel> | undefined>(
    undefined,
  );
  const [videoId, setVideoId] = React.useState(0);

  const { data: weeks, isLoading: weeksIsLoading } =
    useExistingRegularPlaylistWeeksQuery(client);

  const { data: videos, isLoading: videosIsLoading } = useGetVideosByWeekQuery(
    client,
    {
      week,
    },
    {
      enabled: !weeksIsLoading,
      onSuccess: (data) => {
        if (first(data.regularPlaylistByWeek.videos.nodes)?.id) {
          setVideoId(
            first(data.regularPlaylistByWeek.videos.nodes)?.id as number,
          );
        }
      },
    },
  );

  useEffect(() => {
    if (currentWeek) setWeek(currentWeek as number);
  }, []);

  return (
    <HStack spacing={2.5}>
      <Menu isLazy>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              size="sm"
              rightIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <SvgIcon
                  name="icon/chevron_up"
                  boxSize="20px"
                  transform={`rotate(${isOpen ? "0" : "180"}deg)`}
                />
              }
              isLoading={weeksIsLoading}
              variant="ghost"
            >
              {week}주차
            </MenuButton>
            <MenuList
              p={1}
              border="none"
              shadow="2xl"
              minW={0}
              maxH={44}
              overflow="scroll"
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
            >
              {weeks?.existingRegularPlaylistWeeks.map((playlist) => (
                <MenuItem
                  borderRadius={6}
                  key={playlist}
                  onClick={() => {
                    setVideo(undefined);
                    setWeek(playlist);
                  }}
                >
                  <Text variant="body-1">
                    {playlist}
                    주차
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>

      <Menu isLazy>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              size="sm"
              rightIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <SvgIcon
                  name="icon/chevron_up"
                  boxSize="20px"
                  transform={`rotate(${isOpen ? "0" : "180"}deg)`}
                />
              }
              isLoading={weeksIsLoading || videosIsLoading}
              variant="ghost"
            >
              {video?.title ??
                first(videos?.regularPlaylistByWeek.videos.nodes)?.title}
            </MenuButton>
            <MenuList
              p={1}
              border="none"
              shadow="2xl"
              minW={0}
              maxH={44}
              overflow="scroll"
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
            >
              {videos?.regularPlaylistByWeek.videos.nodes?.map((_video) => (
                <MenuItem
                  borderRadius={6}
                  // eslint-disable-next-line react/no-array-index-key
                  key={_video.id}
                  onClick={() => {
                    setVideo(_video);
                    setVideoId(_video.id);
                  }}
                >
                  <Text variant="body-1"> {_video.title}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>

      <Button
        variant="outline"
        size="lg"
        isLoading={videosIsLoading}
        onClick={() => navigate(`/lesson/${videoId}`)}
      >
        강의 이동
      </Button>
    </HStack>
  );
};
