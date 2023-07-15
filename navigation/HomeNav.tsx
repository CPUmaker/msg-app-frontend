import { View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { Octicons, Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import Colors from "../constants/Colors";
import ChatScreen from "../screens/ChatScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";
import AddPeopleScreen from "../screens/AddpeopleScreen";
import { User } from "../utils/types";
import QRCodeScreen from "../screens/QRCodeScreen";

export type NativeStackParamList = {
  Home: undefined;
  Chat: {
    name: string;
    conversationId: string;
  };
  ChatDetails: {
    conversationId: string;
  };
  AddPeople: {
    name: string;
    conversationId: string;
    users?: Array<User>;
  };
  QRCode: undefined;
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

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
        options={({ navigation }) => ({
          title: "Chats",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 70,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("QRCode")}>
                <Ionicons name="camera-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", {
                    name: "New Chat",
                    conversationId: null,
                  })
                }
              >
                <Ionicons name="create-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route, navigation }) => ({
          title: route.params.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ChatDetails", {
                  conversationId: route.params.conversationId,
                })
              }
            >
              <Ionicons
                name="ellipsis-vertical-sharp"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ChatDetails"
        component={ChatDetailsScreen}
        options={{ title: "Chat Details" }}
      />
      <Stack.Screen
        name="AddPeople"
        component={AddPeopleScreen}
        options={{
          title: "Add People",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{ title: "Add Friend" }}
      />
    </Stack.Navigator>
  );
}
