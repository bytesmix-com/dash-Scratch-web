import { Box } from "@chakra-ui/react";
import {
  AppPageContent,
  AppPageHeader,
  AppPageShell,
} from "@dicolabs-kr/web.ui.base.page-shell.app-page-shell";
import React, { ReactElement } from "react";
import { getChildByType } from "react-nanny";

export interface PageShellProps {
  children: ReactElement[];
}

const PageShell = ({ children }: PageShellProps) => {
  const header = getChildByType(children, [
    AppPageHeader,
  ]) as unknown as JSX.Element;

  const content = getChildByType(children, [
    AppPageContent,
  ]) as unknown as JSX.Element;

  return (
    <Box
      id="page-shell"
      sx={{
        "--header-height": "136px",
        ">div>div>div>div": {
          height: "initial",
          minHeight: "100vh",
        },
      }}
      bg="gray.700"
    >
      <AppPageShell>
        {React.cloneElement(header, {
          h: "var(--header-height)",
        })}
        {content}
      </AppPageShell>
    </Box>
  );
};

export default PageShell;
