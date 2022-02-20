import "@fontsource/kanit";
import "pretendard/dist/web/static/pretendard.css";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "app/core/theme";
import defaultRequestErrorHandler from "app/core/utils/errors/default-request-error-handler";
import handleRetry from "app/core/utils/errors/handle-retry";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRoutes } from "react-router-dom";

import { routes } from "./routes";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: defaultRequestErrorHandler,
      retry: handleRetry,
      retryDelay: 1000,
    },
    mutations: {
      onError: defaultRequestErrorHandler,
      retry: handleRetry,
      retryDelay: 1000,
    },
  },
});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        {children}
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export const App = () => {
  const element = useRoutes([...routes]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Suspense fallback={<></>}>
      <Providers>{element}</Providers>
    </React.Suspense>
  );
};
