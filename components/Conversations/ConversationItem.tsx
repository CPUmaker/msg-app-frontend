import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "@rneui/themed";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { Conversation, Message, Participant } from "../../utils/types";
import { HomeScreenProps } from "../../screens/HomeScreen";
import { AuthContext } from "../../context/AuthContext";

export interface ChatListItemProps {
  conversation: Conversation;
  navigation: HomeScreenProps["navigation"];
}

type AvatarData = {
  image_url: string;
};

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

const dataList: AvatarData[] = [
  {
    image_url: "https://uifaces.co/our-content/donated/6MWH9Xi_.jpg",
  },
  {
    image_url: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    image_url:
      "https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg",
  },
  {
    image_url:
      "https://cdn.pixabay.com/photo/2014/09/17/20/03/profile-449912__340.jpg",
  },
  {
    image_url:
      "https://cdn.pixabay.com/photo/2020/09/18/05/58/lights-5580916__340.jpg",
  },
  {
    image_url:
      "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg",
  },
];

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
      ? `${participants[0].user.username} and others`
      : participantsExcludeYou.length === 1
      ? participants[0].user.username
      : "You";

  const enterChatScreen = () => {
    navigation.navigate("Chat", {
      name: conversationName,
      conversationId: conversation.id,
    });
  };

  return (
    // <View style={styles.container}>
    <TouchableOpacity style={styles.container} onPress={enterChatScreen}>
      <Avatar
        containerStyle={styles.avatar}
        size={60}
        rounded
        source={{ uri: dataList[1].image_url }}
      />
      <View style={styles.rightContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.username}>{conversationName}</Text>
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
          {latestMessage.body}
        </Text>
      </View>
    </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
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
