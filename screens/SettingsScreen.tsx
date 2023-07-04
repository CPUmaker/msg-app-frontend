import React from "react";
import { StyleSheet } from "react-native";

import { View, Text } from "../components/Themed";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
