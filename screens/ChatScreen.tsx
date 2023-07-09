import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Keyboard, KeyboardEvent } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchBar } from "@rneui/themed";

import { NativeStackParamList } from "../navigation/HomeNav";
import MessagesWrapper from "../components/Messages";
import Input from "../components/Input";
import UsersWrapper from "../components/Users";

export type ChatScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "Chat"
>;

export default function ChatScreen({ route, navigation }: ChatScreenProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsloading] = useState(false);

  function updateIsLoading(state: boolean) {
    setIsloading(state);
  }

  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!route.params.conversationId) {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Enter a name or email"
          onChangeText={setSearch}
          value={search}
          platform="ios"
          showLoading={isLoading}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onCancel={() => navigation.goBack()}
        />
        {search === "" || (
          <UsersWrapper
            searchName={search}
            setSearchBarLoadingState={updateIsLoading}
            operation="create"
            route={route}
            navigation={navigation}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MessagesWrapper route={route} navigation={navigation} />
      <Input conversationId={route.params.conversationId} />
      {keyboardHeight === 0 || <View style={{ height: keyboardHeight }}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: "#f2f2f2",
  },
  searchBarInputContainer: {
    backgroundColor: "white",
  },
});
