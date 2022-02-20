import {
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  useGetRegularPlaylistQuery,
  useModifyRegularPlaylistMutation,
  useRegularPlaylistWeeksQuery,
} from "admin/generated/api/react-query";
import { PlaylistModal, VideoGrid } from "admin/shared/components";
import { DeletePlaylistModal } from "admin/src/dashboard/lecture-management/components/delete-playlist-modal";
import { format } from "date-fns";
import _ from "lodash";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

export const PlaylistDetailInputs = () => {
  const { playlistId } = useParams();

  const formContext = useFormContext();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { setValue, watch, register, getValues } = useForm();

  const useDeleteDisclosureReturn = useDisclosure();
  const usePlayDisclosureReturn = useDisclosure();

  const playlistResponse = useGetRegularPlaylistQuery(
    client,
    {
      regularPlaylistId: Number(playlistId),
    },
    {
      onSuccess: (res) => {
        setValue("id", res.regularPlaylist.id);
        setValue("name", res.regularPlaylist.name);
        setValue("isPublic", res.regularPlaylist.isPublic);
        setValue("week", res.regularPlaylist.week);
        setValue("description", res.regularPlaylist.description);
        setValue(
          "shareScratchWithRegularPlaylistId",
          res.regularPlaylist.shareScratchWithRegularPlaylistId,
        );
      },
    },
  );

  const { data: weekData } = useRegularPlaylistWeeksQuery(client);

  const list = playlistResponse.data?.regularPlaylist;

  const infos = [
    {
      key: "최종수정일",
      value: format(new Date((list?.updatedAt ?? null) as number), "yy.MM.dd"),
    },

    ...(!list
      ? []
      : [
          {
            key: "주차",
            value: `정규 강의 ${list.week}주차`,
          },
        ]),
    {
      key: "최초작성일",
      value: format(new Date((list?.createdAt ?? null) as number), "yy.MM.dd"),
    },
    {
      key: "공개",
      value: (
        <HStack spacing={0.5}>
          <SvgIcon name="icon/public" boxSize="14px" />
          <Text variant="body-3">
            {!list || list?.isPublic ? "공개" : "비공개"}
          </Text>
        </HStack>
      ),
    },
  ];

  const getInfos = () => {
    if (!formContext.watch("isEditing")) {
      return infos;
    }
    return infos.filter(
      (info) => info.key === "최종수정일" || info.key === "최초작성일",
    );
  };

  const { mutate: modify, isLoading: modifyIsLoading } =
    useModifyRegularPlaylistMutation(client);

  const handleModify = () => {
    if (!getValues("name")) {
      toast({ title: "제목을 입력해주세요", status: "error", position: "top" });
      return;
    }
    modify(
      {
        input: {
          id: Number(getValues("id")),
          name: getValues("name") as string,
          isPublic: getValues("isPublic") as boolean,
          week: Number(getValues("week")),
          description: getValues("description") as string,
          shareScratchWithRegularPlaylistId: getValues(
            "shareScratchWithRegularPlaylistId",
          ),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "수정한 내용이 저장되었습니다",
            status: "success",
            position: "top",
          });
          formContext.setValue("isEditing", false);
          queryClient.refetchQueries(["GetRegularPlaylist"]);
        },
      },
    );
  };

  const occupiedWeeks = weekData?.regularPlaylists.map((item) => item.week);

  const { data } = useRegularPlaylistWeeksQuery(client, {});

  return (
    <>
      <HStack justify="space-between" py={6} align="flex-end">
        <Text variant="heading-0">정규 강의 재생목록</Text>

        {!formContext.watch("isEditing") ? (
          <HStack spacing={2}>
            <Button
              variant="outline"
              onClick={useDeleteDisclosureReturn.onOpen}
            >
              삭제하기
            </Button>
            <Button
              colorScheme="blue"
              variant="primary-line"
              onClick={() => formContext.setValue("isEditing", true)}
            >
              수정하기
            </Button>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <Button
              onClick={() => formContext.setValue("isEditing", false)}
              variant="outline"
            >
              취소하기
            </Button>
            <Button
              variant="primary"
              isLoading={modifyIsLoading}
              onClick={handleModify}
            >
              저장하기
            </Button>
          </HStack>
        )}
      </HStack>
      <Divider />

      <Box boxSize={8} />

      <HStack align="flex-start" spacing={8}>
        <VideoGrid
          thumbnails={list?.thumbnails}
          length={list?.videos.pageInfo?.countTotal as number}
          minW="324px"
        />

        <Stack w="full" spacing={0}>
          <Input
            maxW="568px"
            variant={!formContext.watch("isEditing") ? "unstyled" : undefined}
            fontWeight="bold"
            fontSize="18px"
            readOnly={!formContext.watch("isEditing")}
            {...register("name")}
          />

          <Box boxSize={2} />

          <Grid
            mt={2}
            columnGap={8}
            rowGap={1}
            templateColumns={
              !formContext.watch("isEditing")
                ? "repeat(2, 1fr)"
                : "repeat(1, 1fr)"
            }
          >
            {getInfos().map((item) => (
              <Skeleton isLoaded={!playlistResponse.isLoading} key={item.key}>
                <HStack>
                  <Text variant="body-4" color="neutral.500">
                    {item.key}
                  </Text>
                  <Box fontSize="12px" lineHeight="14px" color="neutral.500">
                    {item.value}
                  </Box>
                </HStack>
              </Skeleton>
            ))}
          </Grid>

          {!formContext.watch("isEditing") ? (
            <>
              <Box boxSize={6} />
              <Text variant="body-1">{list?.description}</Text>
              <Box boxSize={10} />
              <Button
                w="110px"
                variant="primary-line"
                rightIcon={<SvgIcon name="icon/playlist" />}
                isDisabled={!formContext.watch("firstVideoId")}
                onClick={() => {
                  formContext.setValue(
                    "videoIdPlayingOnModal",
                    formContext.getValues("firstVideoId"),
                  );
                  usePlayDisclosureReturn.onOpen();
                }}
              >
                재생하기
              </Button>
            </>
          ) : (
            <>
              <Box boxSize={4} />
              <Text variant="body-4" pb={1}>
                공개 여부
              </Text>
              <Switch
                defaultChecked={list?.isPublic}
                {...register("isPublic")}
              />
              <Box boxSize={4} />
              <HStack spacing={1}>
                <Box boxSize="6px" borderRadius={100} bg="blue.500" />
                <Text variant="body-4">
                  스크래치 공유 주차 설정 (설정한 주차에 사용하던 스크래치를
                  계속 사용합니다)
                </Text>
              </HStack>
              <Box boxSize={1} />
              <Menu isLazy {...register("shareScratchWithRegularPlaylistId")}>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      size="md"
                      maxW="88px"
                      p={2}
                      rightIcon={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <SvgIcon
                          name={`icon/unfold_${isOpen ? "less" : "more"}`}
                          boxSize={6}
                          color="neutral.200"
                        />
                      }
                      variant="outline"
                      bg="white"
                      _active={{ bg: "white", border: "1px solid #1060FC" }}
                      border="1px solid #DBDEE7"
                    >
                      <Text variant="body-1">
                        {!watch("shareScratchWithRegularPlaylistId")
                          ? "공유안함"
                          : data?.regularPlaylists.find(
                              (item) =>
                                item.id ===
                                watch("shareScratchWithRegularPlaylistId"),
                            )?.name}
                      </Text>
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
                      <MenuItem
                        borderRadius={6}
                        onClick={() =>
                          setValue("shareScratchWithRegularPlaylistId", null)
                        }
                      >
                        <Text variant="body-1">공유안함</Text>
                      </MenuItem>
                      {data?.regularPlaylists.map((playlist) => (
                        <MenuItem
                          borderRadius={6}
                          key={playlist.id}
                          onClick={() =>
                            setValue(
                              "shareScratchWithRegularPlaylistId",
                              playlist.id,
                            )
                          }
                        >
                          <Text variant="body-1">{playlist.name}</Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>

              <Box boxSize={4} />
              <HStack spacing={1}>
                <Box boxSize="6px" borderRadius={100} bg="blue.500" />
                <Text variant="body-4">주차</Text>
              </HStack>
              <Box boxSize={1} />
              <Menu isLazy {...register("week")}>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      size="md"
                      maxW="88px"
                      p={2}
                      rightIcon={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <SvgIcon
                          name={`icon/unfold_${isOpen ? "less" : "more"}`}
                          boxSize={6}
                          color="neutral.200"
                        />
                      }
                      variant="outline"
                      bg="white"
                      _active={{ bg: "white", border: "1px solid #1060FC" }}
                      border="1px solid #DBDEE7"
                    >
                      <Text variant="body-1">
                        {!watch("week") ? "1" : watch("week")}
                        주차
                      </Text>
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
                      {_.range(1, 21).map((weekNum) => (
                        <MenuItem
                          borderRadius={6}
                          key={weekNum}
                          onClick={() => setValue("week", weekNum)}
                          isDisabled={occupiedWeeks?.includes(weekNum)}
                        >
                          <Text variant="body-1">
                            {weekNum}
                            주차
                          </Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
              <Box boxSize={4} />
              <Text variant="body-4" pb={1}>
                세부 설명
              </Text>
              <Textarea {...register("description")} size="sm" rounded="md" />
            </>
          )}
        </Stack>
      </HStack>
      <Box boxSize={8} />
      <Divider />
      <DeletePlaylistModal
        id={Number(playlistId)}
        useDisclosureReturn={useDeleteDisclosureReturn}
        onClickBack={() => navigate(-1)}
      />
      <PlaylistModal
        useDisclosureReturn={usePlayDisclosureReturn}
        regularWeekNumber={formContext.watch("week")}
      />
    </>
  );
};
