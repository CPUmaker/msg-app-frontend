import { useColorScheme } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import type { Route } from "@react-navigation/routers";
import { Ionicons } from "@expo/vector-icons";

import HomeNav from "./HomeNav";
import SettingsNav from "./SettingsNav";

const Tab = createBottomTabNavigator();

export default function RootNav() {
  const scheme = useColorScheme();

  const getTabBarVisibility = (route: Route<string>) => {
    const routeName = getFocusedRouteNameFromRoute(route) as string;
    const hideOnScreens = ["Chat"];
    return hideOnScreens.indexOf(routeName) <= -1;
  };

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="HomeNav"
          component={HomeNav}
          options={({ route }) => ({
            tabBarLabel: "Chats",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble" size={size} color={color} />
            ),
            tabBarStyle: getTabBarVisibility(route)
              ? { display: "flex" }
              : { display: "none" },
          })}
        />
        <Tab.Screen
          name="SettingsNav"
          component={SettingsNav}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
