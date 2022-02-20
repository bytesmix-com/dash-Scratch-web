import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.SCHEMA_PATH as string, {
  mode: "cors",
  credentials: "include",
});

export default client;
