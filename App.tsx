import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FlashMessage from "react-native-flash-message";
import { ApolloProvider } from "@apollo/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";

import AuthProvider from "./context/AuthContext";
import Navigation from "./navigation";
import { client } from "./graphql";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <>
            <Navigation />
            <FlashMessage position="top" />
          </>
        </ApolloProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
