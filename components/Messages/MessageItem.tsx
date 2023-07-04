import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Message, User } from "../../utils/types";
import { AuthContext } from "../../context/AuthContext";
import Colors from "../../constants/Colors";

export interface MessageItemProps {
  message: Message;
}

const formatRelativeLocale = {
  lastWeek: "p",
  yesterday: "p",
  today: "p",
  other: "MM/dd/yy",
};

const MessageItem = (props: MessageItemProps) => {
  const { userId } = useContext(AuthContext);
  const message = props.message;
  const sender = message.sender as User;

  const isMyMsg = () => sender.id === userId;

  return (
    <View
      style={[
        styles.container,
        isMyMsg() ? styles.containerRight : styles.containerLeft,
      ]}
    >
      <View
        style={[
          styles.message,
          isMyMsg() ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {isMyMsg() || <Text style={styles.username}>{sender.username}</Text>}
        <Text style={styles.bodyText}>{message.body}</Text>
        <Text style={styles.time}>
          {formatRelative(message.createdAt, new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  containerLeft: {
    justifyContent: "flex-start",
  },
  containerRight: {
    justifyContent: "flex-end",
  },
  message: {
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  messageLeft: {
    marginLeft: 5,
    marginRight: 50,
    backgroundColor: "#fff",
  },
  messageRight: {
    marginLeft: 50,
    marginRight: 5,
    backgroundColor: "#dcf8c5",
  },
  username: {
    fontSize: 13,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 16,
  },
  time: {
    fontSize: 11,
    color: "grey",
    alignSelf: "flex-end",
  },
});

export default MessageItem;
