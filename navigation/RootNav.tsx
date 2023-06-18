import { useColorScheme } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import SettingsScreen from "../screens/SettingsScreen";
import HomeNav from "./HomeNav";

const Tab = createBottomTabNavigator();

export default function RootNav() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="HomeNav" component={HomeNav}></Tab.Screen>
        <Tab.Screen name="Settings" component={SettingsScreen}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
