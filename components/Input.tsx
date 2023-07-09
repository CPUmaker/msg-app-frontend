import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { ObjectId } from "bson";

import { AuthContext } from "../context/AuthContext";
import MessageOperations from "../graphql/operations/messages";
import { MessagesData, SendMessageVariables } from "../utils/types";

type InputProps = {
  conversationId: string;
};

const Input = (props: InputProps) => {
  const { userId } = useContext(AuthContext);
  const { conversationId } = props;
  const [text, setText] = useState("");

  const [sendMessage, { loading }] = useMutation<
    { sendMessage: boolean },
    SendMessageVariables
  >(MessageOperations.Mutation.sendMessage, {
    refetchQueries: [MessageOperations.Query.messages, "Messages"],
  });

  const onSendMessage = async () => {
    try {
      const newMessageText = text;
      setText("");

      const newMessage: SendMessageVariables = {
        id: new ObjectId().toString(),
        senderId: userId,
        conversationId,
        body: newMessageText,
      };
      const { data, errors } = await sendMessage({
        variables: { ...newMessage },
        optimisticResponse: { sendMessage: true },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
    } catch (error: any) {
      console.log("onSendMessage error", error);
    }
  };

  const onChangeText = (text: string) => {
    if (text.slice(-1) === "\n") {
      onSendMessage();
    } else {
      setText(text);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type a message"
        value={text}
        returnKeyType="send"
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="camera" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="mic" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 5,
    backgroundColor: "#eee",
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "white",
  },
});

export default Input;
