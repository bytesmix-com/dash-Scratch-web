/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-key */
import {
  Box,
  Center,
  HStack,
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
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  useDeleteVideoMutation,
  useGetRegularPlaylistQuery,
  usePaginatedRecommendedVideosQuery,
} from "admin/generated/api/react-query";
import {
  PlaylistModal,
  TablePagination,
  TableShell,
} from "admin/shared/components";
import _ from "lodash";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useTable } from "react-table";

import { columns } from "./controllers/columns";
import { PlaylistDetailInputs } from "./section/inputs";

interface FormValues {
  currentPage: number;
  videoIdPlayingOnModal: number;
  regularWeekNumber?: number;
  firstVideoId: number;
  week: number;
  isEditing: boolean;
}

export const DashboardLectureManagementRegularPlaylistDetail = () => {
  const { playlistId } = useParams();
  const useDisclosureReturn = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      currentPage: 1,
      videoIdPlayingOnModal: undefined,
      regularWeekNumber: undefined,
      firstVideoId: undefined,
      week: undefined,
      isEditing: false,
    },
  });

  const { watch, setValue } = formMethods;

  const { data, isLoading } = usePaginatedRecommendedVideosQuery(client, {
    playlistFilter: Number(playlistId),
    size: 10,
    page: watch("currentPage"),
  });

  usePaginatedRecommendedVideosQuery(
    client,
    {
      playlistFilter: Number(playlistId),
      size: 10,
      page: 1,
    },
    {
      onSuccess: (res) => {
        if (_.isEmpty(res.paginatedVideos.nodes)) return;
        setValue("firstVideoId", (res.paginatedVideos.nodes ?? [])[0].id);
      },
    },
  );

  useGetRegularPlaylistQuery(
    client,
    {
      regularPlaylistId: Number(playlistId),
    },
    {
      onSuccess: (res) => {
        setValue("week", res.regularPlaylist.week);
      },
    },
  );

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // @ts-ignore
      columns,
      // @ts-ignore
      data: data?.paginatedVideos.nodes ?? [],
    });

  return (
    <>
      <FormProvider {...formMethods}>
        <PlaylistDetailInputs />

        <Box h={8} />
        <TableShell isLoading={isLoading}>
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
              {_.isEmpty(rows) && (
                <Tr>
                  <Td colSpan={9}>
                    <Center py={4}>
                      <Text variant="body-3">업로드 된 강의가 없습니다</Text>
                    </Center>
                  </Td>
                </Tr>
              )}
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()} py={0} px={2} isTruncated>
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
        <PlaylistModal
          useDisclosureReturn={useDisclosureReturn}
          regularWeekNumber={watch("week")}
        />
      </FormProvider>
      <HStack justify="center">
        <TablePagination
          key={JSON.stringify(data)}
          defaultCurrent={1}
          current={watch("currentPage")}
          pageSize={10}
          total={data?.paginatedVideos.pageInfo?.countTotal}
          onChange={(page) => {
            setValue("currentPage", page as number);
          }}
        />
      </HStack>
    </>
  );
};
