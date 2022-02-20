import { HStack, IconButton, Text, useToast } from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import { RegularPlaylistModel } from "admin/generated/api/react-query";
import { format } from "date-fns";
import _ from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CellProps } from "react-table";

import { ListCard } from "../../../components/list-card";

export const columns = [
  {
    Header: () => {
      return <Text>주</Text>;
    },
    accessor: "week",
    Cell: ({ ...props }: CellProps<RegularPlaylistModel>) => {
      return <Text>{props.value}</Text>;
    },
  },
  {
    Header: "목록",
    accessor: "list",
    Cell: ({ ...props }: CellProps<RegularPlaylistModel>) => {
      return <ListCard list={props.row.original} />;
    },
  },
  {
    Header: "수정일",
    accessor: "updatedAt",
    Cell: ({ ...props }: CellProps<RegularPlaylistModel>) => {
      return (
        <Text variant="body-3">{format(props.value || 0, "yy.MM.dd")}</Text>
      );
    },
  },
  {
    Header: "공개",
    accessor: "isPublic",
    Cell: ({ ...props }: CellProps<RegularPlaylistModel>) => {
      return (
        <HStack spacing={0.5}>
          <SvgIcon
            boxSize="14px"
            name={`icon/${props.value ? "public" : "private"}`}
          />
          <Text variant="body-3">{props.value ? "공개" : "비공개"}</Text>
        </HStack>
      );
    },
  },

  {
    Header: "",
    accessor: "buttons",
    Cell: ({ ...props }: CellProps<RegularPlaylistModel>) => {
      const { id, week, videos } = props.row.original;
      const videoList = videos.nodes;
      const navigate = useNavigate();
      const toast = useToast();

      const actions = [
        {
          name: "playlist",
          handleClick: () => {
            if (_.isEmpty(videoList)) {
              toast({
                title: "재생할 영상이 없습니다",
                status: "error",
                position: "top",
              });
              return;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            props.onPlay(videoList[0].id, week);
          },
        },
        {
          name: "edit",
          handleClick: () => {
            navigate(`/dashboard/lecture-management/regular-playlist/${id}`);
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
