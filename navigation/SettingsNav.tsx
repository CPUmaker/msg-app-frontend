import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import SettingsScreen from "../screens/SettingsScreen";
import Colors from "../constants/Colors";
import ProfileScreen from "../screens/ProfileScreen";
import MyQRCodeScreen from "../screens/MyQRCodeScreen";

export type NativeStackParamList = {
  Manual: undefined;
  Profile: undefined;
  MyQRCode: {
    username: string;
    userAvatar: string;
  };
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

export default function SettingsNav() {
  const { dark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: dark ? Colors.dark.tint : Colors.light.tint,
        },
        headerTintColor: dark
          ? Colors.dark.background
          : Colors.light.background,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="Manual"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="MyQRCode"
        component={MyQRCodeScreen}
        options={{
          title: "QR Code",
          headerTitleStyle: {color: "black"},
          headerTransparent: true,
          headerBlurEffect: "light",
          headerStyle: {
            backgroundColor: "transparent",
          },
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
