import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";

import SettingsScreen from "../screens/SettingsScreen";
import Colors from "../constants/Colors";

export type NativeStackParamList = {
  Manual: undefined;
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
    </Stack.Navigator>
  );
}
