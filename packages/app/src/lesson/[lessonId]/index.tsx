/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-no-useless-fragment */
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AppPageContent,
  AppPageHeader,
} from "@dicolabs-kr/web.ui.base.page-shell.app-page-shell";
import { PageShell, SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import {
  FileModel,
  useGetStudentIdQuery,
  useGetVideoQuery,
} from "app/generated/api/react-query";
import { SpacerV } from "app/shared/components";
import { isEmpty } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ModeHorizon } from "../mode/horizon";
import { ModeVertical } from "../mode/vertical";
import { ModeWork } from "../mode/work";
import { ChangeLesson } from "./change-lesson";
import { Material } from "./material";

export const Lesson = () => {
  const { lessonId } = useParams();

  const modes = [
    { value: "vertical", name: "세로 모드" },
    { value: "horizon", name: "가로 모드" },
    { value: "work", name: "작업 모드" },
  ];

  const navigate = useNavigate();

  const data = useGetVideoQuery(client, {
    videoId: Number(lessonId as string),
  });

  const studentId = useGetStudentIdQuery(client, {});

  const video = data.data?.video;

  const materials = video?.files;

  const playlist = video?.playlist;

  const [mode, setMode] = React.useState("vertical");
  // https://scratch-tutoring-web-gui.stg-branch.be
  const scratchUrl = `https://dash.dongseo.ac.kr:82/#${
    studentId.data?.studentMe.id
  }-${
    // eslint-disable-next-line no-nested-ternary
    video?.playlist?.shareScratchWithRegularPlaylistId
      ? `playlist-${video.playlist.shareScratchWithRegularPlaylistId}`
      : video?.shareScratchInRegularPlaylist ||
        video?.playlist?.isScratchSharedToOtherPlaylist
      ? `playlist-${playlist?.id}`
      : video?.id
  }`;

  const renderMode = () => {
    if (data.isLoading || !playlist?.week) {
      return <></>;
    }
    if (mode === "vertical") {
      return (
        <ModeVertical
          week={playlist?.week as number}
          url={video?.video_url as string}
          videoId={video?.id}
          scratchUrl={scratchUrl}
        />
      );
    }
    if (mode === "horizon") {
      return (
        <ModeHorizon
          week={playlist?.week as number}
          url={video?.video_url as string}
          videoId={video?.id}
          scratchUrl={scratchUrl}
        />
      );
    }
    return (
      <ModeWork
        week={playlist?.week as number}
        videoId={video?.id}
        onExit={() => setMode("vertical")}
        url={video?.video_url}
        scratchUrl={scratchUrl}
      />
    );
  };

  return (
    <>
      <PageShell>
        <AppPageHeader
          w="full"
          h="113px"
          height="113px"
          bg="blue.500"
          marginInlineStart="0px !important"
        >
          <Stack
            px={10}
            pt={4}
            pb={6}
            spacing={0}
            boxSize="full"
            maxW="1440px"
            justify="center"
          >
            <Text fontWeight="bold" fontSize="40px" color="white">
              DASH-Scratch
            </Text>
          </Stack>
        </AppPageHeader>
        <AppPageContent align="center">
          <Container w="100%" maxW="1440px">
            {data.isLoading ? (
              <Progress isIndeterminate size="xs" colorScheme="blue" />
            ) : (
              <>
                <Box py={8}>
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <SvgIcon
                        name="icon/arrow_left"
                        boxSize={6}
                        _hover={{ color: "blue.500", cursor: "pointer" }}
                        onClick={() => navigate("/main")}
                      />
                      <Text variant="heading-2">학습하기</Text>
                    </HStack>

                    <ChangeLesson currentWeek={playlist?.week} />
                  </HStack>
                </Box>
                <HStack
                  bg="neutral.50"
                  p={8}
                  justify="space-between"
                  align="center"
                >
                  <Stack spacing={0} justifyContent="center">
                    <Text variant="heading-1">
                      {playlist?.name} {video?.title}
                    </Text>

                    {!isEmpty(materials) && (
                      <>
                        <SpacerV h={4} />

                        <Stack spacing={0}>
                          <Material materials={materials as FileModel[]} />
                        </Stack>

                        <SpacerV h={8} />
                      </>
                    )}

                    <Text variant="body-1">{video?.description}</Text>
                  </Stack>
                  <HStack>
                    <ButtonGroup isAttached variant="outline">
                      {modes.map((_mode) => {
                        const isSelected = _mode.value === mode;
                        return (
                          <Button
                            py={5}
                            px={5}
                            key={_mode.value}
                            ml="-1px"
                            borderColor="neutral.200"
                            bg={isSelected ? "blue.50" : "white"}
                            color={isSelected ? "blue.500" : "neutral.700"}
                            onClick={() => {
                              setMode(_mode.value);
                            }}
                          >
                            {_mode.name}
                          </Button>
                        );
                      })}
                    </ButtonGroup>
                  </HStack>
                </HStack>
                <SpacerV h={4} />
                {renderMode()}
              </>
            )}
          </Container>
        </AppPageContent>
      </PageShell>
    </>
  );
};
