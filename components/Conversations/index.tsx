import { useContext, useEffect } from "react";
import { ImageBackground } from "react-native";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";

import ConversationOperations from "../../graphql/operations/conversations";
import {
  ConversationCreatedSubscriptionData,
  ConversationDeletedData,
  ConversationPopulated,
  ConversationUpdatedData,
  ConversationsData,
} from "../../utils/types";
import ConversationItem from "./ConversationItem";
import { HomeScreenProps } from "../../screens/HomeScreen";
import SwipeableRow from "./SwipeableRow";
import { AuthContext } from "../../context/AuthContext";

const ConversationsWrapper = ({ navigation }: HomeScreenProps) => {
  const { userId } = useContext(AuthContext);

  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Query.conversations, {
    onError: (error) => {
      console.log(`query error: ${error?.message}`);
    },
    pollInterval: 500,
  });

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscription.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(ConversationOperations.Mutation.deleteConversation);

  useSubscription<ConversationUpdatedData>(
    ConversationOperations.Subscription.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: {
            conversation: updatedConversation,
            addedUserIds,
            removedUserIds,
          },
        } = subscriptionData;

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        // check if user is being removed
        if (removedUserIds && removedUserIds.length) {
          const isBeingRemoved = removedUserIds.find((id) => id === userId);
          if (isBeingRemoved) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Query.conversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Query.conversations,
              data: {
                conversations: conversationsData.conversations.filter(
                  (conv) => conv.id !== updatedConversationId
                ),
              },
            });

            return;
          }
        }

        // check if user is being added to conversation
        if (addedUserIds && addedUserIds.length) {
          const isBeingAdded = addedUserIds.find((id) => id === userId);

          if (isBeingAdded) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Query.conversations,
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Query.conversations,
              data: {
                conversations: [
                  ...(conversationsData.conversations || []),
                  updatedConversation,
                ],
              },
            });
          }
        }
      },
    }
  );

  useSubscription<ConversationDeletedData>(
    ConversationOperations.Subscription.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Query.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Query.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });
      },
    }
  );

  if (conversationsLoading) {
    return null;
  }

  const onDeleteConversation = (conversationId: string) => {
    deleteConversation({
      variables: {
        conversationId,
      },
      refetchQueries: [
        ConversationOperations.Query.conversations,
        "Conversations",
      ],
    });
  };

  return (
    <FlashList
      data={conversationsData?.conversations || []}
      renderItem={({ item }) => (
        <SwipeableRow value={item.id} onDelete={onDeleteConversation}>
          <ConversationItem conversation={item} navigation={navigation} />
        </SwipeableRow>
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={50}
    />
  );
};

export default ConversationsWrapper;
