import React, { useContext, useEffect } from "react";
import { FlatList } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { showMessage } from "react-native-flash-message";

import { ChatScreenProps } from "../../screens/ChatScreen";
import { AddPeopleScreenProps } from "../../screens/AddpeopleScreen";
import {
  UpdateParticipantsData,
  UpdateParticipantsVariables,
  UsersData,
  UsersVariables,
} from "../../utils/types";
import UserOperations from "../../graphql/operations/users";
import ConversationOperations from "../../graphql/operations/conversations";
import UserItem from "./UserItem";
import { CreateConversationData } from "../../utils/types";
import { AuthContext } from "../../context/AuthContext";

interface UsersWrapper {
  navigation:
    | ChatScreenProps["navigation"]
    | AddPeopleScreenProps["navigation"];
  route: ChatScreenProps["route"] | AddPeopleScreenProps["route"];
  searchName: string;
  setSearchBarLoadingState: (state: boolean) => void;
  operation: "create" | "update";
}

export default function UsersWrapper(props: UsersWrapper) {
  const { userId } = useContext(AuthContext);
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutation.createConversation
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

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    subscribeToMore,
  } = useQuery<UsersData, UsersVariables>(UserOperations.Query.searchUsers, {
    variables: {
      username: props.searchName,
    },
    onError: (error) => {
      console.log(`query error: ${error?.message}`);
    },
  });

  const onCreateConversation = async (name: string, id: string) => {
    const participantIds = [userId, id];

    try {
      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });
      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }
      const {
        createConversation: { conversationId },
      } = data;
      props.navigation.setParams({
        name: name,
        conversationId,
      });
    } catch (error: any) {
      console.log("createConversations error", error);
    }
  };

  const onUpdateParticipants = async (name: string, id: string) => {
    try {
      if (props.route.name !== "AddPeople") {
        throw new Error("onUpdateParticipants");
      }
      const users = props.route.params.users;
      if (!users) {
        throw new Error("Param `users` is undefined");
      }
      const userIds = users.map((user) => user.id);
      userIds.push(id);
      const { data, errors } = await updateParticipants({
        variables: {
          conversationId: props.route.params.conversationId,
          participantIds: userIds,
        },
      });
      if (!data?.updateParticipants || errors) {
        throw new Error("Failed to create conversation");
      }

      props.navigation.goBack();
      showMessage({
        message: `add ${name} successfully`,
        type: "success",
      });
    } catch (error: any) {
      console.log("createConversations error", error);
    }
  };

  useEffect(() => {
    props.setSearchBarLoadingState(usersLoading);
  }, [usersLoading]);

  if (usersLoading) {
    return null;
  }

  return (
    <FlatList
      data={usersData?.searchUsers || []}
      renderItem={({ item }) => (
        <UserItem
          name={item.username}
          id={item.id}
          avatarImage=""
          onPress={
            props.operation === "create"
              ? onCreateConversation
              : onUpdateParticipants
          }
          navigation={props.navigation}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
