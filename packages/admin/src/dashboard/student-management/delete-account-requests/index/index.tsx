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

  // ?????? : 3, ?????? 2
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
      // ?????? ??????
      if (name === "checkAll" && type === "change") {
        _.range(Number(value.size)).forEach((num) =>
          // @ts-ignore
          setValue(`check-${num}`, value.checkAll),
        );
      }

      // ????????? ?????? ??? ???????????? ??????
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
        <Text variant="heading-0">?????? ?????? ??????</Text>
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
              ?????? ???
            </Button>
            <Button
              size="sm"
              bg={isDone ? "blue.50" : undefined}
              color={isDone ? "blue.500" : undefined}
              onClick={() => toggleIsDone()}
            >
              ?????? ??????
            </Button>
          </ButtonGroup>

          <Box h="32px" w="1px" bg="neutral.200" />

          <Input
            size="sm"
            placeholder="???????????? ???????????????"
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
            ??????
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
              {`${watch("size")}?????? ??????`}
            </MenuButton>
            <MenuList minWidth="240px">
              <Controller
                control={control}
                name="size"
                render={({ field: { onChange, value } }) => (
                  <MenuOptionGroup
                    title="?????? ??????"
                    type="radio"
                    value={value as string}
                    onChange={onChange}
                  >
                    <MenuItemOption value="10">10?????? ??????</MenuItemOption>
                    <MenuItemOption value="20">20?????? ??????</MenuItemOption>
                    <MenuItemOption value="30">30?????? ??????</MenuItemOption>
                    <MenuItemOption value="50">50?????? ??????</MenuItemOption>
                    <MenuItemOption value="100">100?????? ??????</MenuItemOption>
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
                ?????? ??????
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelected(3)}
                isLoading={processRequests.isLoading}
              >
                ?????? ??????
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
