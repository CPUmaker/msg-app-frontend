import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import {
  UpdateParticipantsData,
  UpdateParticipantsVariables,
  UsersInConversationData,
  UsersInConversationVariables,
} from "../utils/types";
import UserOperations from "../graphql/operations/users";
import ConversationOperations from "../graphql/operations/conversations";
import UserItem from "../components/Users/UserItem";
import { NativeStackParamList } from "../navigation/HomeNav";
import { ListItem } from "@rneui/themed";
import SwipeableRow from "../components/Conversations/SwipeableRow";

export type ChatDetailsScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "ChatDetails"
>;

export default function ChatDetailsScreen({
  route,
  navigation,
}: ChatDetailsScreenProps) {
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<UsersInConversationData, UsersInConversationVariables>(
    UserOperations.Query.usersInConversation,
    {
      variables: {
        conversationId: route.params.conversationId,
      },
      onError: (error) => {
        console.log(`query error: ${error?.message}`);
      },
    }
  );

  const [updateParticipants, { loading: updateParticipantsLoading }] =
  useMutation<UpdateParticipantsData, UpdateParticipantsVariables>(
    ConversationOperations.Mutation.updateParticipants,
    {
      refetchQueries: [
        UserOperations.Query.usersInConversation,
        "UsersInConversation",
      ],
    }
  );

  const users = usersData?.usersInConversation || [];

  if (usersLoading || users.length === 0) {
    return <View style={styles.container}></View>;
  }

  const onDeleteParticipant = (userId: string) => {
    const userIds = users.map((user) => user.id);
    updateParticipants({
      variables: {
        participantIds: userIds.filter((id) => id !== userId),
        conversationId: route.params.conversationId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.participantNumber}>{users.length} participants</Text>

      <ListItem containerStyle={styles.addPeopleContainer}>
        <Ionicons name="person-add-outline" size={24} color="black" />
        <ListItem.Content>
          <ListItem.Title>Add People</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron
          onPress={() =>
            navigation.navigate("AddPeople", {
              name: "",
              conversationId: route.params.conversationId,
              users,
            })
          }
        />
      </ListItem>

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <SwipeableRow value={item.id} onDelete={onDeleteParticipant}>
            <UserItem
              name={item.username}
              id={item.id}
              avatarImage={item.avatar}
              onPress={() => {}}
              navigation={navigation}
            />
          </SwipeableRow>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  participantNumber: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
  },
  addPeopleContainer: {
    backgroundColor: "#f2f2f2",
  },
});
