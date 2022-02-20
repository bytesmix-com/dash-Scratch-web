import {
  Box,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Img,
  Text,
} from "@chakra-ui/react";
import SvgIcon from "@scratch-tutoring-web/app/core/components/svg-icon/index";
import _ from "lodash";
import React from "react";

interface VideoGridProps extends GridProps {
  // thumbnail image URLs
  thumbnails?: string[];
  length: number;
}

export const VideoGrid = ({
  thumbnails = [],
  length,
  ...props
}: VideoGridProps) => {
  const populatedArray = [thumbnails[0], thumbnails[1], thumbnails[2]];

  return (
    <Grid
      templateRows={_.isEmpty(thumbnails) ? "repeat(1, 1fr)" : "repeat(2, 1fr)"}
      templateColumns={
        _.isEmpty(thumbnails) ? "repeat(1, 1fr)" : "repeat(2, 1fr)"
      }
      gap={1}
      pos="relative"
      w="324px"
      h="184px"
      {...props}
    >
      {_.isEmpty(thumbnails) ? (
        <GridItem bg="neutral.50" />
      ) : (
        populatedArray.map((thumbnail, index) => (
          <GridItem
            rowSpan={index === 0 ? 2 : undefined}
            // eslint-disable-next-line react/no-array-index-key
            key={`${thumbnail}-${index}`}
            maxH="184px"
          >
            {thumbnail ? (
              <Img
                src={thumbnail}
                boxSize="full"
                objectFit="cover"
                maxH={index === 0 ? "184px" : "92px"}
              />
            ) : (
              <Box
                boxSize="full"
                bg="neutral.50"
                maxH={index === 0 ? "184px" : "92px"}
              />
            )}
          </GridItem>
        ))
      )}
      <HStack
        pos="absolute"
        left={0}
        top="11px"
        spacing={0}
        py={1}
        pl={2}
        pr={5}
        color="white"
        bg="neutral.800"
      >
        <SvgIcon name="icon/playlist-1" boxSize={6} />
        <Text variant="body-2">{length || 0}</Text>
      </HStack>
    </Grid>
  );
};
