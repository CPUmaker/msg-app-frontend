import { gql } from "@apollo/client";

export default {
  Query: {
    user: gql`
      query User {
        user {
          username
          email
          avatar
        }
      }
    `,
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
          avatar
        }
      }
    `,
    usersInConversation: gql`
      query UsersInConversation($conversationId: String!) {
        usersInConversation(conversationId: $conversationId) {
          id
          username
          avatar
        }
      }
    `,
  },
  Mutation: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscription: {},
};
