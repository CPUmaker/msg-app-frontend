import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import * as SecureStore from "expo-secure-store";

import { endpoints } from "../constants/APIs";

const wsLink = new GraphQLWsLink(
  createClient({
    url: endpoints.graphqlSubscript,
    connectionParams: async () => ({
      userId: await SecureStore.getItemAsync("token"),
    }),
  })
);

const httpLink = new HttpLink({
  uri: endpoints.graphql,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});
