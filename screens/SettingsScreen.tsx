import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListItem } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AuthContext } from "../context/AuthContext";
import { NativeStackParamList } from "../navigation/SettingsNav";

export type SettingsScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "Manual"
>;

export default function SettingsScreen({
  route,
  navigation,
}: SettingsScreenProps) {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <ListItem bottomDivider>
          <Ionicons name="person-circle" size={24} color="black" />
          <ListItem.Content>
            <ListItem.Title>Profile</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <ListItem>
          <Ionicons name="exit-outline" size={24} color="black" />
          <ListItem.Content>
            <ListItem.Title>Log Out</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
