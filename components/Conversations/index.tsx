import { FlatList, ImageBackground } from "react-native";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

import ConversationOperations from "../../graphql/operations/conversations";
import { ConversationsData } from "../../utils/types";
import ConversationItem from "./ConversationItem";
import { HomeScreenProps } from "../../screens/HomeScreen";

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
  });

  if (conversationsLoading) {
    return null;
  }
  console.log(conversationsData?.conversations || []);

  return (
    <FlatList
      data={conversationsData?.conversations || []}
      renderItem={({ item }) => (
        <ConversationItem conversation={item} navigation={navigation} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ConversationsWrapper;
