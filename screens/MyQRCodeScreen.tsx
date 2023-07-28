import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";

import { NativeStackParamList } from "../navigation/SettingsNav";

export type MyQRCodeScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "MyQRCode"
>;

export default function MyQRCodeScreen({
  route,
  navigation,
}: MyQRCodeScreenProps) {
  const { username, userAvatar } = route.params;

  return (
    <LinearGradient colors={["#FF61D2", "#FE9090"]} style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode
          value={username}
          size={200}
          logo={{ uri: userAvatar }}
          logoSize={64}
          logoBackgroundColor="transparent"
          logoBorderRadius={10}
          enableLinearGradient={true}
          linearGradient={["#FF61D2", "#FE9090"]}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
