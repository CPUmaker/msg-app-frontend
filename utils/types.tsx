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

export interface UsersData {
  searchUsers: Array<User>
};

export interface UsersVariables {
  username: string;
}

export interface UsersInConversationData {
  usersInConversation: Array<User>
};

export interface UsersInConversationVariables {
  conversationId: string;
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

export interface SendMessageVariables {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
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

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface UpdateParticipantsData {
  updateParticipants: boolean;
}

export interface UpdateParticipantsVariables {
  conversationId: string;
  participantIds: string[];
}
