export interface Conversation {
  id: string;
  participants: Participant[] | string[];
  latestMessage: Message | string;
  updatedAt: number;
}

export interface Participant {
  id: string;
  user: User;
  conversation: Conversation | string;
  hasSeenLatestMessage: boolean;
}

export interface Message {
  id: string;
  conversation: Conversation | string;
  sender: User | string;
  body: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
}

export interface MessagePopulated {
  id: string;
  sender: {
    id: string;
    username: string;
  };
  conversation: string;
  body: string;
  createdAt: number;
}

export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface ConversationPopulated {
  id: string;
  participants: {
    id: string
    user: {
      id: string;
      username: string;
    };
    conversation: string;
    hasSeenLatestMessage: boolean;
  }[];
  latestMessage: MessagePopulated;
  updatedAt: number;
}

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}
