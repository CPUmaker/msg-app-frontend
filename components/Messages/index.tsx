import React from "react";
import { FlatList } from "react-native";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

import MessageOperations from "../../graphql/operations/messages";
import { MessagesData, MessagesVariables } from "../../utils/types";
import MessageItem from "./MessageItem";
import { ChatScreenProps } from "../../screens/ChatScreen";

const MessagesWrapper = ({ route, navigation }: ChatScreenProps) => {
  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    subscribeToMore,
  } = useQuery<MessagesData, MessagesVariables>(
    MessageOperations.Query.messages,
    {
      variables: {
        conversationId: route.params.conversationId,
      },
      onError: (error) => {
        console.log(`query error: ${error?.message}`);
      },
    }
  );

  if (messagesLoading) {
    return null;
  }
  console.log(messagesData?.messages || []);
  return (
    <FlatList
      data={messagesData?.messages || []}
      renderItem={({ item }) => <MessageItem message={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default MessagesWrapper;
