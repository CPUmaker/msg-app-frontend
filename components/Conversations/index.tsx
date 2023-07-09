import { FlatList, ImageBackground } from "react-native";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

import ConversationOperations from "../../graphql/operations/conversations";
import { ConversationsData } from "../../utils/types";
import ConversationItem from "./ConversationItem";
import { HomeScreenProps } from "../../screens/HomeScreen";
import SwipeableRow from "./SwipeableRow";

const ConversationsWrapper = ({ navigation }: HomeScreenProps) => {
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

  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(ConversationOperations.Mutation.deleteConversation);

  if (conversationsLoading) {
    return null;
  }

  const onDeleteConversation = (conversationId: string) => {
    deleteConversation({
      variables: {
        conversationId,
      },
    });
  };

  return (
    <FlatList
      data={conversationsData?.conversations || []}
      renderItem={({ item }) => (
        <SwipeableRow
          value={item.id}
          onDelete={onDeleteConversation}
        >
          <ConversationItem conversation={item} navigation={navigation} />
        </SwipeableRow>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ConversationsWrapper;
