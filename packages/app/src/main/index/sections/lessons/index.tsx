/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import TablePagination from "@scratch-tutoring-web/admin/shared/components/table-pagination/index";
import TableShell from "@scratch-tutoring-web/admin/shared/components/table-shell/index";
import { SvgIcon } from "app/core/components";
import client from "app/core/utils/api/client";
import {
  useQuery,
  useReplaceRouteQuery,
} from "app/core/utils/hook/useReplaceRouteQuery";
import {
  PageInfo,
  useExistingRegularPlaylistWeeksQuery,
  useGetTotalVideoCountOfRegularPlaylistQuery,
  useLastAccessedVideoAndPlaylistQuery,
  useRegularPlaylistByWeekQuery,
  VideoModel,
} from "app/generated/api/react-query";
import { SpacerH, SpacerV } from "app/shared/components";
import { first } from "lodash";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";

import { PercentBar } from "./component";
import { columns } from "./controllers/columns";

interface FormValues {
  search: string;
  size: string;
  currentPage: number;
  checkAll: boolean;
}

export const MainLessons = () => {
  const navigate = useNavigate();

  const toast = useToast();
  const queryParam = useQuery();
  const [currentPlaylistWeek, setCurrentPlaylistWeek] = useState(0);
  const lastAccessedVideo = useLastAccessedVideoAndPlaylistQuery(client);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      size: undefined,
      search: "",
      currentPage: 1,
      checkAll: false,
    },
  });

  const { watch, setValue } = formMethods;

  const {
    data: existingRegularPlaylistWeeksData,
    isLoading: existingRegularPlaylistWeeksLoading,
  } = useExistingRegularPlaylistWeeksQuery(client);

  const { data: lastAccessedVideoAndPlaylist } =
    useLastAccessedVideoAndPlaylistQuery(client);

  const { data: initialPlaylist, isLoading: initialPlaylistIsLoading } =
    useGetTotalVideoCountOfRegularPlaylistQuery(
      client,
      {
        week: currentPlaylistWeek as number,
      },
      {
        enabled:
          !!existingRegularPlaylistWeeksData && currentPlaylistWeek !== 0,
      },
    );

  const playlistByWeek = useRegularPlaylistByWeekQuery(
    client,
    {
      week: currentPlaylistWeek as number,
    },
    {
      enabled: currentPlaylistWeek !== 0,
    },
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columns,
      data:
        (playlistByWeek.data?.regularPlaylistByWeek.videos
          .nodes as VideoModel[]) ?? [],
    });

  useEffect(() => {
    if (
      existingRegularPlaylistWeeksData?.existingRegularPlaylistWeeks &&
      !lastAccessedVideo.isLoading
    )
      setCurrentPlaylistWeek(
        lastAccessedVideo.data?.lastAccessedVideo?.playlist?.week ??
          existingRegularPlaylistWeeksData?.existingRegularPlaylistWeeks[0],
      );
  }, [existingRegularPlaylistWeeksLoading, lastAccessedVideo.isLoading]);

  const continueVideoLearning = (videoId: number | undefined) => {
    if (videoId === undefined) {
      toast.closeAll();
      toast({
        title: "이어할 강의가 없습니다!",
        status: "error",
        position: "top",
      });
      return;
    }
    navigate(`/lesson/${videoId}`);
  };

  // 강의를 한개도 안들었던 유저인지 확인
  const isInitialUser =
    !lastAccessedVideoAndPlaylist?.lastAccessedVideo &&
    !existingRegularPlaylistWeeksLoading;

  // eslint-disable-next-line no-nested-ternary
  const playlist = isInitialUser
    ? initialPlaylist?.regularPlaylistByWeek
    : queryParam.get("week")
    ? playlistByWeek.data?.regularPlaylistByWeek
    : lastAccessedVideoAndPlaylist?.lastAccessedVideo?.playlist;

  const getCountTotal = () => {
    const total = (
      playlistByWeek?.data?.regularPlaylistByWeek.videos.pageInfo as PageInfo
    )?.countTotal as number;
    if (total === undefined) return 0;
    return total;
  };

  const existingWeeks =
    existingRegularPlaylistWeeksData?.existingRegularPlaylistWeeks.sort(
      (a, b) => a - b,
    );

  const weekIsLoading =
    existingRegularPlaylistWeeksLoading || initialPlaylistIsLoading;

  const replaceRoute = useReplaceRouteQuery();
  return (
    <Box p={8} bg="white" shadow="md" w="100%" maxW="1440px">
      <Text variant="heading-1" color="blue.500">
        강의 목록
      </Text>
      <SpacerV h={4} />
      <Box p={8} bg="neutral.50" maxW="1000px">
        {weekIsLoading ? (
          <Box py={2}>
            <Skeleton h={4} w={64} />
          </Box>
        ) : (
          <HStack spacing="10px">
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
                    {currentPlaylistWeek}
                    주차
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
                    {existingWeeks?.map((arg, index) => (
                      <MenuItem
                        borderRadius={6}
                        // eslint-disable-next-line react/no-array-index-key
                        key={arg + index}
                        onClick={() => {
                          replaceRoute({ week: arg });
                          setCurrentPlaylistWeek(arg);
                        }}
                      >
                        <Text variant="body-1">
                          {arg}
                          주차
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </>
              )}
            </Menu>

            <Text variant="heading-2">{playlist?.name}</Text>

            <HStack spacing={0}>
              <Text variant="body-1">총</Text>
              <SpacerH w={0.5} />
              <Text variant="body-2" color="blue.500">
                {playlist?.videos.pageInfo?.countTotal}
              </Text>
              <Text variant="body-1">강</Text>
            </HStack>
          </HStack>
        )}

        <SpacerV h={6} />
        <HStack justify="space-between">
          <Box w="full" maxW="720px">
            <PercentBar
              title="주자학습률"
              percent={Math.floor(playlist?.progress ?? 0)}
            />
            <SpacerV h={2} />
            <PercentBar
              title="전체학습률"
              percent={Math.floor(
                lastAccessedVideoAndPlaylist?.totalAverageProgress ?? 0,
              )}
            />
          </Box>
          <Button
            variant="primary"
            h={14}
            px={6}
            onClick={() =>
              continueVideoLearning(
                isInitialUser
                  ? first(playlist?.videos?.nodes)?.id
                  : (lastAccessedVideoAndPlaylist?.lastAccessedVideo
                      ?.id as number),
              )
            }
          >
            학습 이어하기
          </Button>
        </HStack>
      </Box>
      <SpacerV h={10} />

      <FormProvider {...formMethods}>
        <TableShell isLoading={playlistByWeek.isLoading}>
          <Table {...getTableProps()}>
            <Thead bg="neutral.100">
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps()}
                      isTruncated
                      variant="body-4"
                    >
                      {column.render("Header")}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody color="neutral.800" {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()} isTruncated py={0} px={4}>
                        {cell.render("Cell", {})}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableShell>
      </FormProvider>
      <HStack justify="center">
        <TablePagination
          key={JSON.stringify(playlistByWeek)}
          defaultCurrent={1}
          current={watch("currentPage")}
          pageSize={10}
          total={getCountTotal()}
          onChange={(page) => {
            setValue("currentPage", page as number);
          }}
        />
      </HStack>
    </Box>
  );
};
