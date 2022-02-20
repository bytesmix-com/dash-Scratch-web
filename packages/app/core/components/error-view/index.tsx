import {
  Box,
  Button,
  ButtonProps,
  Center,
  CenterProps,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface ErrorViewProps extends CenterProps {
  heading?: string;
  caption?: string;
  buttonProps?: ButtonProps;
}

export const ErrorView = ({
  heading,
  caption,
  buttonProps,
  ...props
}: ErrorViewProps) => (
  <Center boxSize="full" {...props}>
    <Stack textAlign="center" spacing={0} shouldWrapChildren>
      {heading && (
        <>
          <Heading size="md">{heading}</Heading>
          <Box h={1} />
        </>
      )}
      {caption && <Text>{caption}</Text>}
      <Box h={7} />
      <Button variant="primary" rounded="full" {...buttonProps} />
    </Stack>
  </Center>
);

export default ErrorView;
