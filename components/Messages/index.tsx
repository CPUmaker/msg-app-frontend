import React, { useRef } from "react";
import { FlatList, View } from "react-native";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

import MessageOperations from "../../graphql/operations/messages";
import { MessagesData, MessagesVariables } from "../../utils/types";
import MessageItem from "./MessageItem";
import { ChatScreenProps } from "../../screens/ChatScreen";

const MessagesWrapper = ({ route, navigation }: ChatScreenProps) => {
  const flatList = useRef<FlatList>(null);
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

  const messages = messagesData?.messages || [];

  if (messagesLoading) {
    return null;
  }
  if (messages.length === 0) {
    return (<View style={{flex: 1}}/>)
  }

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageItem message={item} />}
      keyExtractor={(item) => item.id}
      ref={flatList}
      onContentSizeChange={() =>
        flatList.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => flatList.current?.scrollToEnd({ animated: true })}
    />
  );
};

export default MessagesWrapper;
