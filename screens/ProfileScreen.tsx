import { useContext, useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListItem, Dialog } from "@rneui/themed";
import { useMutation, useQuery } from "@apollo/client";
import { showMessage } from "react-native-flash-message";

import { AuthContext } from "../context/AuthContext";
import UserOperations from "../graphql/operations/users";
import { UserProfileData } from "../utils/types";
import { NativeStackParamList } from "../navigation/SettingsNav";

export type ProfileScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "Manual"
>;

export default function ProfileScreen() {
  const { userId } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const toggleDialog = () => setIsVisible((value) => !value);

  const { data: userData, loading: userLoading } = useQuery<UserProfileData>(
    UserOperations.Query.user
  );

  const [createUsername] = useMutation<
    { success: boolean; error: string },
    { username: string }
  >(UserOperations.Mutation.createUsername, {
    refetchQueries: [
        UserOperations.Query.user,
        "User",
    ],
  });

  const onConfirmRename = async () => {
    const { data } = await createUsername({
      variables: {
        username: newUsername,
      },
    });

    if (data?.success) {
      showMessage({
        message: "New name changed successfully!",
        type: "success",
      });
    } else if (data?.error) {
      showMessage({
        message: data.error,
        type: "danger",
      });
    }

    toggleDialog();
  };

  if (userLoading) {
    return <View style={{ flex: 1 }}></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={toggleDialog}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Username: {userData?.user.username}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
      <TouchableOpacity>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Email: {userData?.user.email}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>

      <Dialog isVisible={isVisible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Rename" />
        <ListItem>
          <MaterialIcons
            name="drive-file-rename-outline"
            size={24}
            color="black"
          />
          <ListItem.Input
            placeholder="new username..."
            value={newUsername}
            onChangeText={setNewUsername}
          />
        </ListItem>
        <Dialog.Actions>
          <Dialog.Button title="CONFIRM" onPress={onConfirmRename} />
          <Dialog.Button title="CANCEL" onPress={() => toggleDialog()} />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
