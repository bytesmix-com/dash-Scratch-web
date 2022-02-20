import { Checkbox, HStack, IconButton, Text } from "@chakra-ui/react";
import { StudentModel } from "admin/generated/api/react-query";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RiDeleteBin6Line } from "react-icons/ri";
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
    Cell: ({ ...props }: CellProps<StudentModel>) => {
      const { control } = useFormContext();

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
    Cell: ({ ...props }: CellProps<StudentModel>) => {
      return <Text>{props.value}</Text>;
    },
  },
  {
    Header: "생성일",
    accessor: "createdAt",
    Cell: ({ ...props }: CellProps<StudentModel>) => {
      return <Text>{format(props.value, "yy.MM.dd")}</Text>;
    },
  },
  {
    Header: "활동시작일",
    accessor: "activatedAt",
    Cell: ({ ...props }: CellProps<StudentModel>) => {
      return <Text>{props.value ? format(props.value, "yy.MM.dd") : "-"}</Text>;
    },
  },
  {
    Header: "",
    accessor: "delete",
    Cell: ({ ...props }: CellProps<StudentModel>) => {
      return (
        <HStack justify="flex-end">
          <IconButton
            variant="ghost"
            boxSize={6}
            minW={0}
            paddingInline={0}
            aria-label="delete"
            icon={<RiDeleteBin6Line />}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onClick={() => props.onDelete(props.row.original.id)}
          />
        </HStack>
      );
    },
  },
];
