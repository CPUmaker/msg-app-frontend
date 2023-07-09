import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, ListItem } from "@rneui/themed";
import { useMutation } from "@apollo/client";

import { ChatScreenProps } from "../../screens/ChatScreen";
import { ChatDetailsScreenProps } from "../../screens/ChatDetailsScreen";
import { AddPeopleScreenProps } from "../../screens/AddpeopleScreen";

export interface UserListItemProps {
  name: string;
  id: string;
  avatarImage: string;
  onPress: (name: string, id: string) => void;
  navigation:
    | ChatScreenProps["navigation"]
    | ChatDetailsScreenProps["navigation"]
    | AddPeopleScreenProps["navigation"];
}

const UserItem = (props: UserListItemProps) => {
  return (
    <TouchableOpacity onPress={() => props.onPress(props.name, props.id)}>
    <ListItem
      bottomDivider
      containerStyle={{ backgroundColor: "#f2f2f2" }}
    >
      <Avatar
        rounded
        icon={{
          name: "person-outline",
          type: "material",
          size: 26,
        }}
        containerStyle={{ backgroundColor: "#c2c2c2" }}
      />
      <ListItem.Content>
        <ListItem.Title>{props.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
    </TouchableOpacity>
  );
};

export default UserItem;
