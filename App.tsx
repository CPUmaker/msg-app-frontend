import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import RootNav from "./navigation/RootNav";
import WelcomeScreen from "./screens/WelcomeScreen";

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

  return (
    <>
      {!loaded && null}
      {/* {loaded && <RootNav />} */}
      {loaded && <WelcomeScreen />}
    </>
  );
}
