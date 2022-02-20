/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  RegularPlaylistModel,
  usePaginatedRegularPlaylistQuery,
} from "admin/generated/api/react-query";
import {
  PlaylistModal,
  TablePagination,
  TableShell,
} from "admin/shared/components";
import _ from "lodash";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";

import { DeletePlaylistModal } from "../../components/delete-playlist-modal";
import { EmptyView } from "../../components/empty-view";
import { columns } from "./controllers/columns";

interface FormValues {
  search: string;
  size: string;
  currentPage: number;
  checkAll: boolean;
  stagedSearch: string;
  playlistIdToDelete?: number;
  videoIdPlayingOnModal: number;
  regularWeekNumber?: number;
}

export const DashboardLectureManagementRegularPlaylist = () => {
  const navigate = useNavigate();
  const useDeleteDisclosureReturn = useDisclosure();
  const usePlayDisclosureReturn = useDisclosure();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      size: undefined,
      search: "",
      currentPage: 1,
      checkAll: false,
      playlistIdToDelete: undefined,
      videoIdPlayingOnModal: undefined,
      regularWeekNumber: undefined,
    },
  });

  const { watch, setValue, register, getValues } = formMethods;

  const { data, isLoading } = usePaginatedRegularPlaylistQuery(client, {
    size: 10,
    page: watch("currentPage"),
    nameFilter: _.isEmpty(watch("stagedSearch")) ? null : watch("stagedSearch"),
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // @ts-ignore
      columns,
      data:
        (data?.paginatedRegularPlaylist.nodes as RegularPlaylistModel[]) ?? [],
    });

  const isListEmpty = () =>
    !watch("stagedSearch") &&
    data?.paginatedRegularPlaylist.pageInfo?.countTotal === 0;

  const handleSearch = () => {
    setValue("stagedSearch", getValues("search"));
  };

  return (
    <>
      <HStack justify="space-between" py={6} align="flex-end">
        <Text variant="heading-0">정규 강의</Text>
        <Button colorScheme="blue" onClick={() => navigate("add")}>
          재생목록 추가
        </Button>
      </HStack>

      <Divider />

      <Box boxSize={8} />

      <HStack spacing={1}>
        <Input
          placeholder="제목으로 검색하세요"
          size="sm"
          rounded="md"
          type="text"
          maxW="464px"
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

      <Box boxSize={6} />

      {isListEmpty() ? (
        <EmptyView />
      ) : (
        <>
          <FormProvider {...formMethods}>
            <TableShell isLoading={isLoading}>
              <Table {...getTableProps()}>
                <Thead bg="neutral.100">
                  {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <Th {...column.getHeaderProps()} isTruncated>
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
                          <Td {...cell.getCellProps()} isTruncated>
                            {cell.render("Cell", {
                              onPlay: (id: number, week: number) => {
                                setValue("videoIdPlayingOnModal", id);
                                setValue("regularWeekNumber", week);
                                usePlayDisclosureReturn.onOpen();
                              },
                              onDelete: (id: number) => {
                                setValue("playlistIdToDelete", id);
                                useDeleteDisclosureReturn.onOpen();
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
            <DeletePlaylistModal
              id={watch("playlistIdToDelete")}
              useDisclosureReturn={useDeleteDisclosureReturn}
            />
            <PlaylistModal
              useDisclosureReturn={usePlayDisclosureReturn}
              regularWeekNumber={watch("regularWeekNumber")}
            />
          </FormProvider>
          <HStack justify="center">
            <TablePagination
              key={JSON.stringify(data)}
              defaultCurrent={1}
              current={watch("currentPage")}
              pageSize={10}
              total={data?.paginatedRegularPlaylist.pageInfo?.countTotal}
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
