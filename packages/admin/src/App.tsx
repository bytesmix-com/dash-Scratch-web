import "@fontsource/kanit";
import "pretendard/dist/web/static/pretendard.css";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@scratch-tutoring-web/app/core/theme/index";
import defaultRequestErrorHandler from "@scratch-tutoring-web/app/core/utils/errors/default-request-error-handler";
import handleRetry from "@scratch-tutoring-web/app/core/utils/errors/handle-retry";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Outlet, useRoutes } from "react-router-dom";

import { routes } from "./routes";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: defaultRequestErrorHandler,
      retry: handleRetry,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: defaultRequestErrorHandler,
      retry: handleRetry,
      retryDelay: 1000,
    },
  },
});

export const Providers = ({ children }: { children: ReactNode }) => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  </ChakraProvider>
);

export const App = () => {
  const element = useRoutes(routes);

  // TODO: loader
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Providers>{element}</Providers>
    </React.Suspense>
  );
};

export default App;
