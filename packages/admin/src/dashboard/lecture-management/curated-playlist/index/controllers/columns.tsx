/* eslint-disable camelcase */
import {
  Checkbox,
  HStack,
  IconButton,
  Img,
  Stack,
  Text,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import { formatVideoLength } from "admin/shared/utils/format-video-length";
import { VideoModel } from "app/generated/api/react-query";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    Cell: ({ ...props }: CellProps<VideoModel>) => {
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
    Header: "ID",
    accessor: "id",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { id } = props.row.original;
      return <Text variant="body-3">{id}</Text>;
    },
  },
  {
    Header: "동영상",
    accessor: "video_url",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { video_thumbnail } = props.row.original;
      return (
        <Img
          maxW="initial"
          w="160px"
          h="90px"
          src={video_thumbnail as string}
          objectFit="cover"
        />
      );
    },
  },
  {
    Header: "",
    accessor: "title_and_desc",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { title, description } = props.row.original;
      return (
        <Stack spacing={1} maxW="200px">
          <Text variant="heading-3" isTruncated>
            {title}
          </Text>
          <Text variant="body-3" isTruncated>
            {description ?? "-"}
          </Text>
        </Stack>
      );
    },
  },
  {
    Header: "길이",
    accessor: "video_lengthInSeconds",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { video_lengthInSeconds } = props.row.original;
      return (
        <Text variant="body-3">{formatVideoLength(video_lengthInSeconds)}</Text>
      );
    },
  },
  {
    Header: "작성일",
    accessor: "createdAt",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { createdAt } = props.row.original;
      return <Text variant="body-3">{format(createdAt, "yy.MM.dd")}</Text>;
    },
  },
  {
    Header: "공개",
    accessor: "isPublic",
    Cell: () => {
      return (
        <HStack spacing={0.5}>
          <SvgIcon name="icon/public" boxSize="14px" />
          <Text variant="body-3">공개</Text>
        </HStack>
      );
    },
  },
  {
    Header: "태그",
    accessor: "tags",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { tags } = props.row.original;
      return (
        <Text variant="body-3" maxW="200px" isTruncated>
          {tags}
        </Text>
      );
    },
  },
  {
    Header: "",
    accessor: "action-buttons",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      const { id } = props.row.original;
      const navigate = useNavigate();

      const actions = [
        {
          name: "playlist",
          handleClick: () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            props.onPlay(id);
          },
        },
        {
          name: "edit",
          handleClick: () => {
            navigate(`/dashboard/lecture/${id}`);
          },
        },
        {
          name: "delete",
          handleClick: () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            props.onDelete(id);
          },
        },
      ];

      return (
        <HStack justify="flex-end" spacing={4}>
          {actions.map((action) => (
            <IconButton
              variant="ghost"
              key={action.name}
              aria-label={action.name}
              boxSize={6}
              minW={0}
              fontSize="20px"
              _hover={{ color: "blue.400" }}
              icon={<SvgIcon name={`icon/${action.name}`} />}
              onClick={action.handleClick}
            />
          ))}
        </HStack>
      );
    },
  },
];
