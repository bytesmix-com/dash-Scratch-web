/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  useDeleteVideoMutation,
  usePaginatedRecommendedVideosQuery,
  useRecommendedPlaylistQuery,
} from "admin/generated/api/react-query";
import {
  PlaylistModal,
  TablePagination,
  TableShell,
  VideoGrid,
} from "admin/shared/components";
import { useCheckAll } from "admin/shared/hooks/use-check-all";
import { format } from "date-fns";
import _ from "lodash";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { RiArrowDownSLine, RiSearchLine } from "react-icons/ri";
import { useQueryClient } from "react-query";
import { useTable } from "react-table";

import { EmptyView } from "./components/empty-view";
import { columns } from "./controllers/columns";

interface FormValues {
  search: string;
  size: string;
  currentPage: number;
  checkAll: boolean;
  stagedSearch: string;
  videoIdPlayingOnModal: number;
}

export const DashboardLectureManagementCuratedPlaylist = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const useDisclosureReturn = useDisclosure();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      size: "10",
      search: "",
      currentPage: 1,
      checkAll: false,
      stagedSearch: "",
      videoIdPlayingOnModal: undefined,
    },
  });

  const { register, getValues, control, watch, setValue } = formMethods;

  const { data, isLoading, refetch } = useRecommendedPlaylistQuery(client);

  const { mutate: deleteVideo } = useDeleteVideoMutation(client, {
    onSuccess: () => {
      toast({
        title: "정상적으로 삭제 되었습니다",
        position: "top",
        status: "success",
      });
      queryClient.invalidateQueries();
    },
  });

  const { data: videoListData, isLoading: isLoadingVideoList } =
    usePaginatedRecommendedVideosQuery(
      client,
      {
        playlistFilter: data?.recommendedPlaylist.id,
        size: Number(watch("size")),
        page: watch("currentPage"),
        titleFilter: _.isEmpty(watch("stagedSearch"))
          ? null
          : watch("stagedSearch"),
      },
      {
        enabled: !!data?.recommendedPlaylist.id,
        queryKey: [watch("size")],
      },
    );

  const { data: firstVideoData } = usePaginatedRecommendedVideosQuery(client, {
    playlistFilter: data?.recommendedPlaylist.id,
    size: 1,
    page: 1,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // @ts-ignore
      columns,
      // @ts-ignore
      data: videoListData?.paginatedVideos.nodes ?? [],
    });

  useCheckAll<FormValues>({ formMethods });

  const isListEmpty = () => false;

  const handleSearch = () => {
    setValue("stagedSearch", getValues("search"));
    refetch();
  };

  const handleDeleteSelected = () => {
    const ids = Object.keys(getValues())
      .filter((key) => /check-\d/.test(key))
      .filter((key) => {
        // @ts-ignore
        const value = getValues(key);
        // @ts-ignore
        setValue(key, false);
        return value;
      })
      .map((key) =>
        parseInt(
          (videoListData?.paginatedVideos.nodes ?? [])[
            parseInt(key.split("-")[1], 10)
          ].id.toString(),
          10,
        ),
      );
    deleteVideo({ ids });
    setValue("checkAll", false);
  };

  const handleClickPlay = () => {
    if (!firstVideoData?.paginatedVideos?.nodes) {
      toast({
        title: "재생할 영상이 없습니다",
        status: "error",
        position: "top",
      });
      return;
    }

    setValue(
      "videoIdPlayingOnModal",
      firstVideoData?.paginatedVideos.nodes[0].id,
    );

    useDisclosureReturn.onOpen();
  };

  return (
    <>
      <HStack justify="space-between" py={6} align="flex-end">
        <Text variant="heading-0">추천 강의</Text>
      </HStack>
      <Divider />
      <HStack py={6} spacing={6} align="flex-start">
        <Skeleton isLoaded={!isLoading}>
          <VideoGrid
            thumbnails={data?.recommendedPlaylist.thumbnails}
            length={
              data?.recommendedPlaylist.videos.pageInfo?.countTotal as number
            }
          />
        </Skeleton>
        <Stack justify="space-between" minH="184px">
          <Stack spacing={0}>
            <Text variant="heading-2">추천 강의 재생목록</Text>
            <Box h={2} />
            <Skeleton isLoaded={!isLoading}>
              <HStack spacing={1} color="neutral.500">
                <Text variant="body-4">최종수정일</Text>
                <Text variant="body-3">
                  {format(
                    data?.recommendedPlaylist?.updatedAt ?? new Date(),
                    "yy.MM.dd",
                  )}
                </Text>
              </HStack>
            </Skeleton>
            <Box h={1} />
            <Skeleton isLoaded={!isLoading}>
              <HStack spacing={1} color="neutral.500">
                <Text variant="body-4">공개</Text>
                <HStack spacing={0.5}>
                  <SvgIcon name="icon/public" boxSize="14px" />
                  <Text variant="body-3">공개</Text>
                </HStack>
              </HStack>
            </Skeleton>
          </Stack>
          <Button
            colorScheme="blue"
            variant="outline"
            rightIcon={<SvgIcon boxSize={5} name="icon/playlist" />}
            onClick={handleClickPlay}
            disabled={_.isEmpty(videoListData?.paginatedVideos.nodes)}
          >
            재생하기
          </Button>
        </Stack>
      </HStack>
      <Divider />
      <HStack pt={8} pb={6} justify="space-between">
        <HStack spacing={1}>
          <Input
            placeholder="제목으로 검색하세요"
            size="sm"
            rounded="md"
            type="text"
            {...register("search")}
          />
          <Button
            size="sm"
            variant="outline"
            rightIcon={<RiSearchLine />}
            colorScheme="blue"
            sx={{
              ".chakra-button__icon": {
                marginInlineStart: "4px !important",
              },
            }}
            onClick={handleSearch}
          >
            검색
          </Button>
        </HStack>
        <HStack spacing={1}>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              rightIcon={<RiArrowDownSLine />}
              variant="outline"
              size="sm"
            >
              {`${watch("size")}개씩 보기`}
            </MenuButton>
            <MenuList minWidth="240px">
              <Controller
                control={control}
                name="size"
                render={({ field: { onChange, value } }) => {
                  return (
                    <MenuOptionGroup
                      title="보기 선택"
                      type="radio"
                      value={value}
                      onChange={onChange}
                    >
                      <MenuItemOption value="10">10개씩 보기</MenuItemOption>
                      <MenuItemOption value="20">20개씩 보기</MenuItemOption>
                      <MenuItemOption value="30">30개씩 보기</MenuItemOption>
                      <MenuItemOption value="50">50개씩 보기</MenuItemOption>
                      <MenuItemOption value="100">100개씩 보기</MenuItemOption>
                    </MenuOptionGroup>
                  );
                }}
              />
            </MenuList>
          </Menu>
          <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
            선택 삭제
          </Button>
        </HStack>
      </HStack>
      {isListEmpty() ? (
        <EmptyView />
      ) : (
        <>
          <FormProvider {...formMethods}>
            <TableShell isLoading={isLoading || isLoadingVideoList}>
              <Table {...getTableProps()}>
                <Thead bg="neutral.100">
                  {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <Th {...column.getHeaderProps()} isTruncated px={2}>
                          {column.render("Header")}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody color="neutral.800" {...getTableBodyProps()}>
                  {_.isEmpty(rows) && !_.isEmpty(watch("stagedSearch")) && (
                    <Tr>
                      <Td colSpan={9}>
                        <Center py={4}>
                          <Text variant="body-3">결과가 없습니다</Text>
                        </Center>
                      </Td>
                    </Tr>
                  )}
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <Tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <Td
                            {...cell.getCellProps()}
                            py={0}
                            px={2}
                            isTruncated
                          >
                            {cell.render("Cell", {
                              onDelete: (id: number) => {
                                deleteVideo({ ids: [id] });
                              },
                              onPlay: (id: number) => {
                                setValue("videoIdPlayingOnModal", id);
                                useDisclosureReturn.onOpen();
                              },
                            })}
                          </Td>
                        ))}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableShell>
            <PlaylistModal useDisclosureReturn={useDisclosureReturn} />
          </FormProvider>
          <HStack justify="center">
            <TablePagination
              key={JSON.stringify(videoListData)}
              defaultCurrent={1}
              current={watch("currentPage")}
              pageSize={Number(watch("size"))}
              total={videoListData?.paginatedVideos.pageInfo?.countTotal}
              onChange={(page) => {
                setValue("currentPage", page as number);
              }}
            />
          </HStack>
        </>
      )}
    </>
  );
};
