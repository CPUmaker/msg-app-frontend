import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { NativeStackParamList } from "../navigation/HomeNav";
import MessagesWrapper from "../components/Messages";

export type ChatScreenProps = NativeStackScreenProps<NativeStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: ChatScreenProps) {
  return (
    <View style={styles.container}>
      <MessagesWrapper route={route} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
