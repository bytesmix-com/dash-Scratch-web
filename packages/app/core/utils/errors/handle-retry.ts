import { GraphQLError } from "graphql";
import { ClientError } from "graphql-request";

const handleRetry = (failureCount: number, error: unknown) => {
  const code = ((error as ClientError)?.response?.errors as GraphQLError[])[0]
    ?.extensions?.code;

  if (code === "UNAUTHENTICATED") return false;

  return failureCount < 1;
};

export default handleRetry;
