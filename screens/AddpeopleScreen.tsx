import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchBar } from "@rneui/themed";

import { NativeStackParamList } from "../navigation/HomeNav";
import UsersWrapper from "../components/Users";

export type AddPeopleScreenProps = NativeStackScreenProps<
  NativeStackParamList,
  "AddPeople"
>;

export default function AddPeopleScreen({
  route,
  navigation,
}: AddPeopleScreenProps) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsloading] = useState(false);

  function updateIsLoading(state: boolean) {
    setIsloading(state);
  }

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
      <UsersWrapper
        searchName={search}
        setSearchBarLoadingState={updateIsLoading}
        operation="update"
        route={route}
        navigation={navigation}
      />
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
