import { Badge, Button, Checkbox, HStack, Text } from "@chakra-ui/react";
import { DeleteStudentRequestModel } from "admin/generated/api/react-query";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CellProps } from "react-table";

export const columns = [
  {
    Header: () => {
      const { control } = useFormContext();

      return (
        <Controller
          control={control}
          name="checkAll"
          render={({ field: { onChange, value, ref } }) => (
            <Checkbox onChange={onChange} ref={ref} isChecked={value} />
          )}
        />
      );
    },
    accessor: "checkAll",
    Cell: ({ ...props }: CellProps<DeleteStudentRequestModel>) => {
      const { control } = useFormContext();
      if (props.row.original.status === 2 || props.row.original.status === 3) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
      }
      return (
        <Controller
          control={control}
          name={`check-${props.row.id}`}
          render={({ field: { onChange, value, ref } }) => (
            <Checkbox onChange={onChange} ref={ref} isChecked={!!value} />
          )}
        />
      );
    },
  },
  {
    Header: "학번",
    accessor: "studentNumber",
    Cell: ({ ...props }: CellProps<DeleteStudentRequestModel>) => {
      return <Text>{props.value}</Text>;
    },
  },
  {
    Header: "요청일",
    accessor: "createdAt",
    Cell: ({ ...props }: CellProps<DeleteStudentRequestModel>) => {
      return <Text>{format(props.value, "yy.MM.dd")}</Text>;
    },
  },
  {
    Header: "처리일",
    accessor: "updatedAt",
    Cell: ({ ...props }: CellProps<DeleteStudentRequestModel>) => {
      return <Text>{format(props.value, "yy.MM.dd")}</Text>;
    },
  },
  {
    Header: "",
    accessor: "delete",
    Cell: ({ ...props }: CellProps<DeleteStudentRequestModel>) => {
      const isApproved = () => props.row.original.status === 3;
      return (
        <HStack justify="flex-end" spacing={8}>
          {props.row.original.status === 1 ? (
            <>
              <Button
                variant="ghost"
                size="md"
                px={2}
                h={6}
                minW={0}
                aria-label="delete"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={() => props.onApprove(props.row.original.id)}
              >
                승인
              </Button>
              <Button
                variant="ghost"
                size="md"
                px={2}
                h={6}
                minW={0}
                aria-label="delete"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={() => props.onDeny(props.row.original.id)}
              >
                거절
              </Button>
            </>
          ) : (
            <Badge
              borderRadius={20}
              h="21px"
              px="7px"
              bg={isApproved() ? "green.50" : "red.50"}
              border={`1px solid ${isApproved() ? "#00D193" : "#FF4343"}`}
            >
              <Text color={isApproved() ? "green.500" : "red.500"}>
                {isApproved() ? "승인" : "거절"}
              </Text>
            </Badge>
          )}
        </HStack>
      );
    },
  },
];
