import { IconButton, Link, Text } from "@chakra-ui/react";
import { VideoModel } from "@scratch-tutoring-web/admin/generated/api/react-query";
import SvgIcon from "app/core/components/svg-icon/index";
import { ProcessBadge } from "app/shared/components";
import { format } from "date-fns";
import React from "react";
import { CellProps } from "react-table";

import { VideoCard } from "../component";

export const columns = [
  {
    Header: "",
    accessor: "sort",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      return <Text variant="body-3">{props.row.index + 1}</Text>;
    },
  },
  {
    Header: "동영상",
    accessor: "video_thumbnail",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      return <VideoCard video={props.row.original} />;
    },
  },
  {
    Header: "길이",
    accessor: "video_lengthInSeconds",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      return (
        <Text variant="body-3">{format(props.value * 1000, "mm:ss")}</Text>
      );
    },
  },
  {
    Header: "첨부파일",
    accessor: "files",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      if (props.value.length !== 0) {
        return (
          <Link href={props.value[0].url}>
            <IconButton
              variant="ghost"
              boxSize={6}
              minW={0}
              paddingInline={0}
              aria-label="play"
              icon={<SvgIcon name="icon/download" />}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
            />
          </Link>
        );
      }
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    },
  },
  {
    Header: "",
    accessor: "progress",
    Cell: ({ ...props }: CellProps<VideoModel>) => {
      return <ProcessBadge process={props.value} />;
    },
  },
];
