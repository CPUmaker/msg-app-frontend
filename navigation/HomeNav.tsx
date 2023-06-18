import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import Colors from "../constants/Colors";

const Stack = createNativeStackNavigator();

export default function HomeNav() {
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
        name="Home"
        component={HomeScreen}
        options={{
          title: "Chats",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 60,
                justifyContent: "space-between",
              }}
            >
              <Octicons name="search" size={24} color={"white"} />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={"white"}
              />
            </View>
          ),
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
