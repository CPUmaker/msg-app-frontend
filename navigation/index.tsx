import { useContext } from "react";
import RootNav from "./RootNav";
import { AuthContext } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";

export default function Navigation() {
  const { isAuthed } = useContext(AuthContext);

  return isAuthed ? <RootNav /> : <WelcomeScreen />;
}
