import { gql } from "@apollo/client";

export default {
  Query: {
    user: gql`
      query User {
        user {
          username
          email
        }
      }
    `,
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
        }
      }
    `,
    usersInConversation: gql`
      query UsersInConversation($conversationId: String!) {
        usersInConversation(conversationId: $conversationId) {
          id
          username
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
