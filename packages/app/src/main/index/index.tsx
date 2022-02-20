import {
  AppPageContent,
  AppPageHeader,
} from "@dicolabs-kr/web.ui.base.page-shell.app-page-shell";
import PageShell from "app/core/components/page-shell/index";
import { SpacerV } from "app/shared/components";
import React from "react";

import { MainHeader } from "./sections/header";
import { MainLessons } from "./sections/lessons";
import { MainRecommendContents } from "./sections/recommend-contents";

export const Main = () => (
  <PageShell>
    <AppPageHeader
      w="full"
      h="var(--header-height)"
      bg="blue.500"
      marginInlineStart="0px !important"
    >
      <MainHeader />
    </AppPageHeader>
    <AppPageContent bg="neutral.50" align="center" p={10}>
      <MainRecommendContents />
      <SpacerV h={8} />
      <MainLessons />
    </AppPageContent>
  </PageShell>
);
