import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Divider } from "@rneui/themed";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Conversation, Message, Participant } from "../../utils/types";
import { HomeScreenProps } from "../../screens/HomeScreen";
import { AuthContext } from "../../context/AuthContext";

export interface ChatListItemProps {
  conversation: Conversation;
  navigation: HomeScreenProps["navigation"];
}

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

const ConversationItem = (props: ChatListItemProps) => {
  const { userId } = useContext(AuthContext);
  const { conversation, navigation } = props;
  const latestMessage = conversation.latestMessage as Message;
  const participants = conversation.participants as Participant[];
  const participantsExcludeYou = participants.filter(
    (p) => p.user.id !== userId
  );
  const conversationName =
    participantsExcludeYou.length >= 2
      ? `${participantsExcludeYou[0].user.username} and others`
      : participantsExcludeYou.length === 1
      ? participantsExcludeYou[0].user.username
      : "You";

  const enterChatScreen = () => {
    navigation.navigate("Chat", {
      name: conversationName,
      conversationId: conversation.id,
    });
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={enterChatScreen}>
        <Avatar
          containerStyle={styles.avatar}
          size={60}
          rounded
          source={{
            uri:
              participantsExcludeYou[0].user.avatar ??
              "https://randomuser.me/api/portraits/men/36.jpg",
          }}
        />
        <View style={styles.rightContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.username} numberOfLines={1}>
              {conversationName}
            </Text>
            <Text style={styles.time}>
              {formatRelative(conversation.updatedAt, new Date(), {
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
          <Text numberOfLines={2} style={styles.latestMessage}>
            {latestMessage?.body}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider inset={true} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  avatar: {
    marginHorizontal: 10,
  },
  rightContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    maxWidth: "75%",
  },
  latestMessage: {
    fontSize: 14,
    color: "grey",
  },
  time: {
    fontSize: 13,
    color: "grey",
  },
});

export default ConversationItem;
