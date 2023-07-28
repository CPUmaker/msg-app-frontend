import { useContext, useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListItem, Dialog, Avatar } from "@rneui/themed";
import { useMutation, useQuery } from "@apollo/client";
import { showMessage } from "react-native-flash-message";
import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../context/AuthContext";
import UserOperations from "../graphql/operations/users";
import { UserProfileData } from "../utils/types";
import { NativeStackParamList } from "../navigation/SettingsNav";
import ListDivider from "../components/ListDivider";

export type ProfileScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "Profile"
>;

export default function ProfileScreen({navigation}: ProfileScreenProps) {
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
    refetchQueries: [UserOperations.Query.user, "User"],
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
      <ListItem
        linearGradientProps={{
          colors: ["#FF61D2", "#FE9090"],
          start: { x: 1, y: 0 },
          end: { x: 0.2, y: 0 },
        }}
        ViewComponent={LinearGradient}
      >
        <Avatar rounded source={{ uri: userData?.user.avatar }} size={64} />
        <ListItem.Content>
          <ListItem.Title style={{ color: "white", fontWeight: "bold" }}>
            {userData?.user.username}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "white" }}>
            {userData?.user.email}
          </ListItem.Subtitle>
        </ListItem.Content>
        <TouchableOpacity onPress={() => navigation.navigate("MyQRCode", {
          username: userData?.user.username ?? "",
          userAvatar: userData?.user.avatar ?? "",
        })}>
          <Ionicons name="qr-code" size={24} color="#0C6157" />
        </TouchableOpacity>
      </ListItem>

      <TouchableOpacity>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Avatar</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>

      <ListDivider />

      <TouchableOpacity onPress={toggleDialog}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Change Username</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>

      <TouchableOpacity>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Change Email</ListItem.Title>
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
