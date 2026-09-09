import { gql } from 'graphql-tag';
import notificationResolvers from './notification.resolvers';

export const typeDefs = gql`
  type Notification {
    id: ID!
    message: String!
    user: ID!
    type: String!
    read: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    notifications: [Notification!]!
    latestNotifications(limit: Int): [Notification!]!
  }

  type Mutation {
    createNotification(message: String!, user: ID!, type: String): Notification!
    markNotificationRead(id: ID!): Notification!
  }
`;

export const resolvers = {
  Query: {
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...notificationResolvers.Mutation,
  },
}; 