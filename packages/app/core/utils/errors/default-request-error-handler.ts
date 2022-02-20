import { createStandaloneToast } from "@chakra-ui/react";
import theme from "app/core/theme";
import client from "app/core/utils/api/client";
import { queryClient } from "app/src/App";
import { GraphQLError } from "graphql";
import { ClientError, gql } from "graphql-request";
import _ from "lodash";

import { handleKnownError } from "./handle-known-error";

// TODO: sentry
const defaultRequestErrorHandler = (error: unknown) =>
  handleClientError(error as ClientError);

const handleClientError = (error: ClientError, isRetrying = false) => {
  const { request, response } = error;

  if (!response || !response?.errors) {
    handleUnknownRequestError(error);
    return;
  }

  const code = response?.errors[0]?.extensions?.code;
  if (code === "UNAUTHENTICATED" && !isRetrying) {
    const query = gql`
      mutation Mutation {
        refresh
      }
    `;

    client
      // try refresh token
      .request(query)
      // refresh 성공 시 원래 request 호출
      .then(() => {
        client
          .request(request.query as string, request.variables)
          .then(() => queryClient.invalidateQueries())
          .catch((err) => {
            // 원래 request 호출에 실패
            handleClientError(err, true);
          });
      })
      // refresh 실패 시
      .catch(() => {
        // 로그인, 회원가입, 이메일 인증 페이지일 경우 noop
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/register" ||
          window.location.pathname === "/verify-email"
        )
          return;
        // 다른 페이지일 경우 로그인 페이지로 이동
        window.location.href = `${window.location.origin}/login`;
      });

    return;
  }

  if (handleKnownError(code)) return;

  handleUnknownRequestError(error);
};

const handleUnknownRequestError = (error: ClientError) => {
  const toast = createStandaloneToast({ theme });

  let message;

  if (_.isEmpty(error.response)) {
    message = "ClientError.response empty";
  } else if (_.isEmpty(error.response.errors)) {
    message = "ClientError.response.errors empty";
  } else if (_.isEmpty((error.response.errors as GraphQLError[])[0].message)) {
    message = "GraphQLError message empty.";
  } else {
    message = (error.response.errors as GraphQLError[])[0].message;
  }

  toast({
    title: "An error occured.",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  });
};

export default defaultRequestErrorHandler;
