/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-key */
import {
  Button,
  Divider,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import client from "@scratch-tutoring-web/app/core/utils/api/client";
import {
  useDeleteStudentsMutation,
  usePaginatedStudentsQuery,
} from "admin/generated/api/react-query";
import { TablePagination, TableShell } from "admin/shared/components";
import { useCheckAll } from "admin/shared/hooks/use-check-all";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { RiArrowDownSLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";

import { EmptyView } from "./components/empty-view";
import { columns } from "./controllers/columns";

interface FormValues {
  search: string;
  size: string;
  currentPage: number;
  checkAll: boolean;
}

export const DashboardStudentManagementAccounts = () => {
  const navigate = useNavigate();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      size: "10",
      search: "",
      currentPage: 1,
      checkAll: false,
    },
  });

  const { register, getValues, control, watch, setValue } = formMethods;

  useCheckAll<FormValues>({ formMethods });

  const { data, isLoading, refetch } = usePaginatedStudentsQuery(client, {
    idFilter: watch("search"),
    size: Number(watch("size")),
    page: watch("currentPage"),
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // @ts-ignore
      columns,
      data: data?.paginatedStudents.nodes ?? [],
    });

  const deleteStudents = useDeleteStudentsMutation(client, {
    onSuccess: () => {
      refetch();
    },
  });
  // TODO
  const isListEmpty = () => false;

  // const handleSearch = () => {};

  const handleDeleteSelected = () => {
    // TODO
    const studentIds = Object.keys(getValues())
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
          (data?.paginatedStudents.nodes ?? [])[
            parseInt(key.split("-")[1], 10)
          ].id.toString(),
          10,
        ),
      );
    deleteStudents.mutate({ studentIds });
    setValue("checkAll", false);
  };

  return (
    <>
      <HStack justify="space-between" py={6} align="flex-end">
        <Text variant="heading-0">전체 학생 조회</Text>
        <Button colorScheme="blue" onClick={() => navigate("add")}>
          학생 추가
        </Button>
      </HStack>
      <Divider />
      {isListEmpty() ? (
        <EmptyView />
      ) : (
        <>
          <HStack pt={8} pb={6} justify="space-between">
            <HStack spacing={1}>
              <Input
                placeholder="학번으로 검색하세요"
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
                // onClick={handleSearch}
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
                    render={({ field: { onChange, value } }) => (
                      <MenuOptionGroup
                        title="보기 선택"
                        type="radio"
                        value={value as string}
                        onChange={onChange}
                      >
                        <MenuItemOption value="10">10개씩 보기</MenuItemOption>
                        <MenuItemOption value="20">20개씩 보기</MenuItemOption>
                        <MenuItemOption value="30">30개씩 보기</MenuItemOption>
                        <MenuItemOption value="50">50개씩 보기</MenuItemOption>
                        <MenuItemOption value="100">
                          100개씩 보기
                        </MenuItemOption>
                      </MenuOptionGroup>
                    )}
                  />
                </MenuList>
              </Menu>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                isLoading={deleteStudents.isLoading}
              >
                선택 삭제
              </Button>
            </HStack>
          </HStack>
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
                <Tbody
                  color="neutral.800"
                  {...getTableBodyProps()}
                  sx={{ ".chakra-text": { fontSize: "xs" } }}
                >
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <Tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <Td {...cell.getCellProps()} isTruncated>
                            {cell.render("Cell", {
                              onDelete: (id: number) => {
                                deleteStudents.mutate({ studentIds: [id] });
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
          </FormProvider>
          <HStack justify="center">
            <TablePagination
              key={JSON.stringify(data)}
              defaultCurrent={1}
              current={watch("currentPage")}
              pageSize={Number(watch("size"))}
              total={data?.paginatedStudents.pageInfo?.countTotal}
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
