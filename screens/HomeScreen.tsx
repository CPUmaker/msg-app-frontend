import React from "react";
import { StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { View } from "../components/Themed";
import ConversationsWrapper from "../components/Conversations";
import { NativeStackParamList } from "../navigation/HomeNav";

export type HomeScreenProps = NativeStackScreenProps<NativeStackParamList, "Home">;

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <ConversationsWrapper route={route} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
