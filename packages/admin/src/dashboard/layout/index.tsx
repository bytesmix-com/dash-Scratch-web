import { Container, HStack } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

import { DashboardLayoutContentShell } from "./components/content-shell";
import { DashboardLayoutFooter } from "./components/footer";
import { DashboardLayoutSidebar } from "./components/sidebar";

export const DashboardLayout = () => (
  <>
    <Container maxW="1440px">
      <HStack spacing={8} align="flex-start">
        <DashboardLayoutSidebar />
        <DashboardLayoutContentShell>
          <Outlet />
        </DashboardLayoutContentShell>
      </HStack>
    </Container>
    <DashboardLayoutFooter />
  </>
);
