/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable camelcase */
import {
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Switch,
  Tag,
  Text,
  Textarea,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useMediaUploader } from "@dicolabs-kr/web.util.hook.core";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  AddOrModifyVideoInput,
  useAddOrModifyVideoMutation,
  useRegularPlaylistNameQuery,
  useSavedVideoQuery,
  useScrapeYoutubeVideoLinkMutation,
} from "admin/generated/api/react-query";
import { isValidYoutubeUrl } from "admin/shared/utils/is-valid-youtube-url";
import _ from "lodash";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RiCloseLine, RiPlayCircleLine } from "react-icons/ri";
import ReactPlayer from "react-player";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { EmptyView } from "./components/empty-view";

interface FormValues {
  listType: "regular" | "recommended";
  videoURL: string;
  title: string;
  isPublic: boolean;
  description?: string;
  files: { url: string; fileName: string }[];
  tags: string;
  stagedVideoURL: string;
  playlist: number;
  video_url: string;
  video_title: string;
  video_createdAt: number;
  video_channelName: string;
  video_lengthInSeconds: number;
  video_thumbnail: string;
  recommendWeeks: number[];
  shareScratchInRegularPlaylist: boolean;
}

export const DashboardLecture = () => {
  const toast = useToast();
  const { id } = useParams();
  const isNew = () => id === "new";
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { register, control, watch, handleSubmit, getValues, setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        listType: "regular",
        videoURL: "",
        title: "",
        isPublic: true,
        description: "",
        files: [],
        tags: "",
        stagedVideoURL: "",
        video_url: "",
        video_title: "",
        video_createdAt: 0,
        video_channelName: "",
        video_lengthInSeconds: 0,
        video_thumbnail: "",
        recommendWeeks: [],
        shareScratchInRegularPlaylist: false,
      },
    });

  useEffect(() => {
    reset();
  }, [pathname]);

  const [upload, isUploading] = useMediaUploader({
    folder_id: "01FTX8NTA13D0E5X7S0J7AYXDM",
    project_key: "01FTAMF4DYFMGQTHJED2RMW0QB",
    options: {
      allowMultiple: true,
      accept: "*",
      random_file_name: true,
      version: 2,
    },
  });

  const { data, isLoading } = useRegularPlaylistNameQuery(
    client,
    {},
    {
      onSuccess: (res) => {
        if (_.isEmpty(res.regularPlaylists)) return;
        setValue("playlist", res.regularPlaylists[0].id);
      },
    },
  );

  const { isLoading: isLoadingSavedData } = useSavedVideoQuery(
    client,
    {
      videoId: Number(id),
    },
    {
      enabled: !isNew(),
      onSuccess: (res) => {
        const {
          description,
          files,
          isPublic,
          playlist,
          title,
          video_url,
          tags,
          recommendWeeks,
          video_title,
          video_createdAt,
          video_channelName,
          video_lengthInSeconds,
          video_thumbnail,
          shareScratchInRegularPlaylist,
        } = res.video;

        const listType = playlist ? "regular" : "recommended";

        setValue("listType", listType);
        setValue("title", title);
        setValue("description", description ?? "");
        setValue("stagedVideoURL", video_url);
        setValue("video_url", video_url);
        setValue("video_title", video_title);
        setValue("video_createdAt", video_createdAt);
        setValue("video_channelName", video_channelName);
        setValue("video_lengthInSeconds", video_lengthInSeconds);
        setValue("video_thumbnail", video_thumbnail as string);
        setValue("videoURL", video_url);
        setValue(
          "shareScratchInRegularPlaylist",
          shareScratchInRegularPlaylist,
        );

        setValue(
          "files",
          files.map((file) => _.omit(file, ["id"])),
        );

        if (listType === "regular") {
          setValue("playlist", playlist?.id as number);
          setValue("isPublic", isPublic);
        } else {
          setValue("tags", tags ?? "");
          setValue("recommendWeeks", recommendWeeks ?? []);
          setValue("isPublic", true);
        }

        // handleUploadYoutubeVideo();
      },
    },
  );

  const { mutate, isLoading: isSubmitting } =
    useAddOrModifyVideoMutation(client);

  const scrapeYoutubeLink = useScrapeYoutubeVideoLinkMutation(client);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!values.stagedVideoURL) {
      toast({
        title: "유튜브 영상을 업로드 해주세요.",
        status: "error",
        position: "top",
      });
      return;
    }

    const isRegularPlaylist = values.listType === "regular";

    const {
      video_title,
      video_createdAt,
      video_channelName,
      video_lengthInSeconds,
      video_thumbnail,
      title,
      description,
      shareScratchInRegularPlaylist,
    } = values;

    const common: Partial<AddOrModifyVideoInput> = {
      id: isNew() ? null : Number(id),
      video_url: getValues("stagedVideoURL"),
      video_title,
      video_createdAt,
      video_channelName,
      video_lengthInSeconds,
      video_thumbnail,
      isRegularPlaylist,
      shareScratchInRegularPlaylist,
      title,
      description: description ?? null,
    };

    const regular: Partial<AddOrModifyVideoInput> = {
      playlistId: Number(values.playlist),
      isPublic: values.isPublic,
      files: values.files,
    };

    const recommended: Partial<AddOrModifyVideoInput> = {
      tags: values.tags,
      recommendWeeks: values.recommendWeeks,
    };

    mutate(
      {
        input: {
          ...common,
          ...(isRegularPlaylist ? regular : recommended),
        } as AddOrModifyVideoInput,
      },
      {
        onSuccess: () => {
          toast({
            title: isNew()
              ? "강의가 업로드 되었습니다"
              : "수정한 내용이 저장되었습니다",
            status: "success",
            position: "top",
          });
          navigate(-1);
        },
      },
    );
  };

  const shouldShowEmptyView = () =>
    !isLoading &&
    watch("listType") === "regular" &&
    _.isEmpty(data?.regularPlaylists);

  const handleUploadYoutubeVideo = async () => {
    if (!isValidYoutubeUrl(getValues("videoURL"))) {
      toast({
        title: "올바른 Youtube 주소가 아닙니다.",
        status: "error",
        position: "top",
      });
      return;
    }

    const { scrapeYoutubeVideoLink } = await scrapeYoutubeLink.mutateAsync({
      youtubeUrl: getValues("videoURL"),
    });
    setValue("videoURL", scrapeYoutubeVideoLink.video_link);
    setValue("stagedVideoURL", scrapeYoutubeVideoLink.video_link);
    setValue("video_title", scrapeYoutubeVideoLink.video_title);
    setValue("video_createdAt", scrapeYoutubeVideoLink.video_createdAt);
    setValue("video_channelName", scrapeYoutubeVideoLink.video_channelName);
    setValue(
      "video_lengthInSeconds",
      scrapeYoutubeVideoLink.video_lengthInSeconds,
    );
    setValue(
      "video_thumbnail",
      scrapeYoutubeVideoLink.video_thumbnail as string,
    );
  };

  const pushWeeks = (index: number) => {
    const weeks = getValues("recommendWeeks");
    if (weeks.includes(index)) return;
    weeks.push(index);
    setValue("recommendWeeks", weeks);
  };

  const spliceWeeks = (index: number) => {
    const weeks = getValues("recommendWeeks");
    weeks.splice(index, 1);
    setValue("recommendWeeks", weeks);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HStack py={6} align="flex-end" spacing={3}>
        <Text variant="heading-0">강의 업로드</Text>
      </HStack>
      <Divider />
      <Center
        bg="neutral.50"
        borderWidth={1}
        borderColor="neutral.100"
        rounded={4}
        w="320px"
        h="180px"
        mt={8}
      >
        {watch("stagedVideoURL") ? (
          <ReactPlayer
            url={watch("stagedVideoURL")}
            width="320px"
            height="180px"
          />
        ) : (
          <Icon
            boxSize="68px"
            as={RiPlayCircleLine}
            color="neutral.800"
            opacity={0.2}
          />
        )}
      </Center>

      <Skeleton isLoaded={!isLoadingSavedData}>
        <HStack align="flex-end" shouldWrapChildren mt={4} mb={8}>
          <FormControl isRequired>
            <FormLabel>URL</FormLabel>
            <Input
              minW="500px"
              placeholder="강의 영상이 업로드 된 URL을 입력하세요"
              {...register("videoURL")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUploadYoutubeVideo();
                }
              }}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={scrapeYoutubeLink.isLoading}
            onClick={handleUploadYoutubeVideo}
          >
            업로드
          </Button>
        </HStack>
        <Stack
          bg="neutral.50"
          borderWidth={1}
          borderColor="neutral.100"
          p={4}
          sx={{
            "input, textarea, select": { bg: "white" },
            ".chakra-form__label": {
              mb: 1,
              fontSize: "sm",
              fontWeight: "bold",
            },
          }}
          spacing={4}
          shouldWrapChildren
        >
          <Controller
            control={control}
            name="listType"
            render={({ field: { onChange, value, ref } }) => (
              <RadioGroup onChange={onChange} value={value} ref={ref}>
                <HStack spacing="24px">
                  <Radio value="regular">정규강의 재생목록</Radio>
                  <Radio value="recommended">추천강의 재생목록</Radio>
                </HStack>
              </RadioGroup>
            )}
          />
          <Divider borderColor="neutral.200" />
          {shouldShowEmptyView() ? (
            <EmptyView />
          ) : (
            <Stack spacing={4}>
              {watch("listType") === "regular" && (
                <FormControl isRequired>
                  <FormLabel>목록</FormLabel>
                  <Select
                    placeholder={
                      isLoading ? "강의 목록을 불러오는 중..." : undefined
                    }
                    {...register("playlist")}
                  >
                    {data?.regularPlaylists.map((playlist) => (
                      <option value={playlist.id} key={playlist.id}>
                        {`${playlist.name}`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>강의 제목</FormLabel>
                <Input
                  placeholder="강의 제목을 입력하세요"
                  {...register("title")}
                />
              </FormControl>
              {watch("listType") === "regular" && (
                <FormControl>
                  <FormLabel htmlFor="email-alerts" mb="0">
                    소속 주차 내 스크래치 공유
                  </FormLabel>
                  <HStack>
                    <Controller
                      name="shareScratchInRegularPlaylist"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Switch
                          colorScheme="blue"
                          onChange={onChange}
                          ref={ref}
                          isChecked={value}
                        />
                      )}
                    />
                    <Text>
                      {watch("shareScratchInRegularPlaylist")
                        ? "공유"
                        : "비공유"}
                    </Text>
                  </HStack>
                </FormControl>
              )}
              {watch("listType") === "regular" && (
                <FormControl>
                  <FormLabel htmlFor="email-alerts" mb="0">
                    공개 여부
                  </FormLabel>
                  <HStack>
                    <Controller
                      name="isPublic"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Switch
                          colorScheme="blue"
                          onChange={onChange}
                          ref={ref}
                          isChecked={value}
                        />
                      )}
                    />
                    <Text>{watch("isPublic") ? "공개" : "비공개"}</Text>
                  </HStack>
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>세부설명</FormLabel>
                <Textarea
                  placeholder="세부 설명을 입력하세요"
                  {...register("description")}
                />
              </FormControl>
              {watch("listType") === "regular" && (
                <FormControl>
                  <FormLabel>첨부파일</FormLabel>
                  <Stack pb={4}>
                    {watch("files").map((file) => (
                      <HStack
                        key={file.url}
                        cursor="pointer"
                        onClick={() => window.open(file.url)}
                        color="blue.500"
                        spacing={1}
                      >
                        <SvgIcon name="icon/download" boxSize={6} />
                        <Text>{file.fileName}</Text>
                        <Icon
                          as={RiCloseLine}
                          boxSize={6}
                          onClick={(e) => {
                            e.stopPropagation();
                            setValue(
                              "files",
                              getValues("files").filter(
                                (item) => item.url !== file.url,
                              ),
                            );
                          }}
                          color="black"
                        />
                      </HStack>
                    ))}
                  </Stack>
                  <Button
                    variant="outline"
                    bg="white"
                    isLoading={isUploading}
                    isDisabled={isUploading}
                    onClick={async () => {
                      if (isUploading) return;
                      const resultList = (await upload()) as {
                        url: string;
                        file: File;
                      }[];
                      if (!_.isEmpty(resultList)) {
                        setValue("files", [
                          ...getValues("files"),
                          ...resultList.map((result) => ({
                            url: result.url,
                            fileName: result.file.name,
                          })),
                        ]);
                      }
                    }}
                  >
                    파일 추가하기
                  </Button>
                </FormControl>
              )}
              {watch("listType") === "recommended" && (
                <>
                  <FormControl isRequired>
                    <FormLabel>태그</FormLabel>
                    <Input
                      placeholder="강의 주제 태그를 ,로 구분하여 입력하세요"
                      {...register("tags")}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>추천 주차</FormLabel>
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
                            variant="ghost"
                          >
                            1 주차
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
                            {Array(20)
                              .fill("")
                              ?.map((arg, index) => (
                                <MenuItem
                                  borderRadius={6}
                                  // eslint-disable-next-line react/no-array-index-key
                                  key={arg + index}
                                  onClick={() => {
                                    pushWeeks(index + 1);
                                  }}
                                >
                                  <Text variant="body-1">
                                    {index + 1}
                                    주차
                                  </Text>
                                </MenuItem>
                              ))}
                          </MenuList>
                        </>
                      )}
                    </Menu>
                  </FormControl>

                  <Wrap>
                    {watch("recommendWeeks").map((week, index) => (
                      <Tag
                        key={week}
                        borderRadius={20}
                        bg="blue.50"
                        color="blue.500"
                        border="1px solid #1060FC"
                        cursor="pointer"
                        onClick={() => spliceWeeks(index)}
                      >
                        <HStack>
                          <Text>{week}주차</Text>
                          <SvgIcon name="icon/close" />
                        </HStack>
                      </Tag>
                    ))}
                  </Wrap>
                </>
              )}
            </Stack>
          )}
        </Stack>
      </Skeleton>
      {!shouldShowEmptyView() && (
        <Button
          mt={8}
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
        >
          저장하기
        </Button>
      )}
    </form>
  );
};
