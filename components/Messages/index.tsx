import React, { useContext, useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";

import MessageOperations from "../../graphql/operations/messages";
import { MessagesData, MessagesSubscriptionData, MessagesVariables } from "../../utils/types";
import MessageItem from "./MessageItem";
import { ChatScreenProps } from "../../screens/ChatScreen";
import { AuthContext } from "../../context/AuthContext";

const MessagesWrapper = ({ route, navigation }: ChatScreenProps) => {
  const { userId } = useContext(AuthContext);
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

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [...prev.messages, newMessage],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(route.params.conversationId);

    return () => unsubscribe();
  }, [route.params.conversationId]);

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
