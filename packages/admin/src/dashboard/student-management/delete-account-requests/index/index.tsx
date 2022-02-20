/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  ButtonGroup,
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
  DeleteStudentRequestModel,
  usePaginatedDeleteStudentRequestsQuery,
  useProcessDeleteStudentRequestsMutation,
} from "admin/generated/api/react-query";
import { TablePagination, TableShell } from "admin/shared/components";
import _, { isEmpty } from "lodash";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { RiArrowDownSLine, RiSearchLine } from "react-icons/ri";
import { useTable } from "react-table";

import { EmptyView } from "./components/empty-view";
import { columns } from "./controllers/columns";

interface FormValues {
  search: string;
  size: string;
  currentPage: number;
  checkAll: boolean;
}

export const DashboardStudentManagementDeleteAccountRequests = () => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      size: "10",
      search: "",
      currentPage: 1,
      checkAll: false,
    },
  });

  const { register, getValues, control, watch, setValue } = formMethods;

  const [isDone, setIsDone] = useState(false);

  const toggleIsDone = () => {
    if (isDone) {
      setIsDone(false);
      return;
    }
    setIsDone(true);
  };

  const { data, isLoading, refetch } = usePaginatedDeleteStudentRequestsQuery(
    client,
    {
      idFilter: watch("search"),
      statusFilter: isDone ? 3 : 1,
      size: Number(watch("size")),
      page: watch("currentPage"),
    },
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<DeleteStudentRequestModel>({
      // @ts-ignore
      columns,
      data: (data?.paginatedDeleteStudentRequests.nodes ??
        []) as DeleteStudentRequestModel[],
    });

  const processRequests = useProcessDeleteStudentRequestsMutation(client, {
    onSuccess: () => {
      refetch();
    },
  });

  const isListEmpty = () =>
    !isLoading && isEmpty(data?.paginatedDeleteStudentRequests.nodes);

  // 승인 : 3, 거절 2
  const handleSelected = (status: number) => {
    const ids = Object.keys(getValues())
      .filter((key) => /check-\d/.test(key))
      .filter((key) => {
        // @ts-ignore
        const value = getValues(key);
        // @ts-ignore
        setValue(key, false);
        return value;
      })
      .filter((key) => {
        return (
          (data?.paginatedDeleteStudentRequests.nodes ?? [])[
            parseInt(key.split("-")[1], 10)
          ]?.status === 1
        );
      })
      .map(
        (key) =>
          (data?.paginatedDeleteStudentRequests.nodes ?? [])[
            parseInt(key.split("-")[1], 10)
          ].id,
      );
    processRequests.mutate({ ids, status });
    setValue("checkAll", false);
  };

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // 전체 선택
      if (name === "checkAll" && type === "change") {
        _.range(Number(value.size)).forEach((num) =>
          // @ts-ignore
          setValue(`check-${num}`, value.checkAll),
        );
      }

      // 페이지 변경 시 전체선택 해제
      if (name === "currentPage") {
        _.range(Number(value.size)).forEach((num) => {
          // @ts-ignore
          setValue(`check-${num}`, false);
          setValue("checkAll", false);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <HStack justify="space-between" py={6} align="flex-end">
        <Text variant="heading-0">계정 삭제 요청</Text>
      </HStack>
      <Divider />

      <HStack pt={8} pb={6} justify="space-between">
        <HStack spacing={2}>
          <ButtonGroup isAttached variant="outline">
            <Button
              size="sm"
              bg={!isDone ? "blue.50" : undefined}
              color={!isDone ? "blue.500" : undefined}
              onClick={() => toggleIsDone()}
              borderRight="none"
            >
              처리 전
            </Button>
            <Button
              size="sm"
              bg={isDone ? "blue.50" : undefined}
              color={isDone ? "blue.500" : undefined}
              onClick={() => toggleIsDone()}
            >
              처리 완료
            </Button>
          </ButtonGroup>

          <Box h="32px" w="1px" bg="neutral.200" />

          <Input
            size="sm"
            placeholder="학번으로 검색하세요"
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
            minW="70px"
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
                    <MenuItemOption value="100">100개씩 보기</MenuItemOption>
                  </MenuOptionGroup>
                )}
              />
            </MenuList>
          </Menu>

          {!isDone && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelected(2)}
                isLoading={processRequests.isLoading}
              >
                선택 거절
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelected(3)}
                isLoading={processRequests.isLoading}
              >
                선택 승인
              </Button>
            </>
          )}
        </HStack>
      </HStack>
      {isListEmpty() ? (
        <EmptyView isDone={isDone} isSearched={!!watch("search")} />
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
                              onApprove: (id: number) => {
                                processRequests.mutate({
                                  ids: [id],
                                  status: 3,
                                });
                              },
                              onDeny: (id: number) => {
                                processRequests.mutate({
                                  ids: [id],
                                  status: 2,
                                });
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
              total={data?.paginatedDeleteStudentRequests.pageInfo?.countTotal}
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
