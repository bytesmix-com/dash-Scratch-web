import { Box, Container, Divider, HStack, Text } from "@chakra-ui/react";
import React from "react";

export const DashboardLayoutFooter = () => (
  <>
    <Box h="200px" />
    <Divider />
    <Container maxW="1440px">
      <HStack h={10} />
    </Container>
    <Divider />
    <Box bg="blue.50">
      <Container maxW="1440px" bg="blue.50" py={6}>
        <Box bg="blue.50">
          <Text color="neutral.500" fontSize="12">
            © All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  </>
);
