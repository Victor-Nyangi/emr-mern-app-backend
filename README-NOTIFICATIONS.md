# Notification System Implementation

This document describes the implementation of a comprehensive notification system for the EMR application using GraphQL.

## Overview

The notification system provides real-time notifications to users with the following features:
- User-specific notifications
- Different notification types (info, success, warning, error)
- Read/unread status tracking
- Real-time updates with polling
- Notification alerts in the top menu
- Full notification management page

## Backend Implementation

### 1. Notification Model (`src/models/Notification.ts`)

```typescript
{
  message: String (required),
  user: ObjectId (ref: User, required),
  type: String (enum: ['info', 'success', 'warning', 'error']),
  read: Boolean (default: false),
  timestamps: true
}
```

### 2. GraphQL Setup

#### Apollo Server Configuration (`src/app.ts`)
- GraphQL endpoint: `/graphql`
- Authentication context with JWT token
- User context for permission-based queries

#### Schema (`src/graphql/index.ts`)
```graphql
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
```

#### Resolvers (`src/graphql/notification.resolvers.ts`)
- `notifications`: Get all notifications for authenticated user
- `latestNotifications`: Get latest N notifications for authenticated user
- `createNotification`: Create a new notification
- `markNotificationRead`: Mark a notification as read

## Frontend Implementation

### 1. Apollo Client Setup

#### Apollo Client Configuration (`lib/apollo-client.ts`)
- HTTP link to backend GraphQL endpoint
- Authentication headers with JWT token
- In-memory cache

#### Apollo Provider (`wrappers/apollo-provider.tsx`)
- Wraps the application with Apollo Client
- Provides GraphQL context to all components

### 2. GraphQL Operations (`lib/graphql/notifications.ts`)

```typescript
// Queries
GET_NOTIFICATIONS
GET_LATEST_NOTIFICATIONS

// Mutations
CREATE_NOTIFICATION
MARK_NOTIFICATION_READ
```

### 3. Components

#### Notification Alert (`components/notifications/notification-alert.tsx`)
- Shows 3 latest notifications in dropdown
- Unread count badge
- Real-time polling (30 seconds)
- Different icons for notification types
- Link to full notifications page

#### Notifications Page (`app/(admin)/notifications/page.tsx`)
- Full table view of all notifications
- Filtering and sorting
- Read/unread status display
- Action menu for each notification

#### Notification Columns (`components/notifications/columns.tsx`)
- Message with timestamp
- Type badges (info, success, warning, error)
- Read/unread status
- Action menu (mark as read, view details)

### 4. Utility Functions (`lib/notification-utils.ts`)

```typescript
createNotification({ message, userId, type })
createInfoNotification(message, userId)
createSuccessNotification(message, userId)
createWarningNotification(message, userId)
createErrorNotification(message, userId)
```

## Usage

### 1. Backend Setup

1. Install dependencies:
```bash
npm install apollo-server-express graphql @apollo/server graphql-tag
```

2. Start the backend server:
```bash
npm run dev
```

3. Seed test notifications:
```bash
npm run seed-notifications
```

### 2. Frontend Setup

1. Install dependencies:
```bash
pnpm add @apollo/client graphql
```

2. Start the frontend:
```bash
pnpm dev
```

### 3. Creating Notifications

```typescript
import { createSuccessNotification } from '@/lib/notification-utils';

// Create a notification
await createSuccessNotification('Payment received!', userId);
```

### 4. Testing

1. Login to the application
2. Check the notification bell in the top menu
3. Navigate to `/notifications` to see all notifications
4. Use the seed script to create test notifications

## GraphQL Queries

### Get All Notifications
```graphql
query GetNotifications {
  notifications {
    id
    message
    user
    type
    read
    createdAt
    updatedAt
  }
}
```

### Get Latest Notifications
```graphql
query GetLatestNotifications($limit: Int) {
  latestNotifications(limit: $limit) {
    id
    message
    user
    type
    read
    createdAt
    updatedAt
  }
}
```

### Create Notification
```graphql
mutation CreateNotification($message: String!, $user: ID!, $type: String) {
  createNotification(message: $message, user: $user, type: $type) {
    id
    message
    user
    type
    read
    createdAt
    updatedAt
  }
}
```

### Mark Notification as Read
```graphql
mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id) {
    id
    message
    user
    type
    read
    createdAt
    updatedAt
  }
}
```

## Features

### ✅ Implemented
- [x] Notification model with MongoDB
- [x] GraphQL schema and resolvers
- [x] Apollo Server setup
- [x] Apollo Client configuration
- [x] Notification alert component
- [x] Notifications page with table
- [x] Real-time polling
- [x] Authentication integration
- [x] Test data seeding
- [x] Utility functions for creating notifications

### 🔄 Future Enhancements
- [ ] WebSocket real-time updates
- [ ] Push notifications
- [ ] Email notifications
- [ ] Notification preferences
- [ ] Bulk actions (mark all as read)
- [ ] Notification categories
- [ ] Notification history

## Security

- All GraphQL queries require authentication
- Users can only access their own notifications
- JWT token validation on all requests
- Input validation and sanitization

## Performance

- Apollo Client caching for better performance
- Polling interval of 30 seconds for real-time updates
- Pagination support for large notification lists
- Optimistic updates for better UX

## Troubleshooting

### Common Issues

1. **GraphQL endpoint not found**
   - Ensure backend is running on port 3001
   - Check Apollo Server setup in `app.ts`

2. **Authentication errors**
   - Verify JWT token is stored in localStorage
   - Check token expiration

3. **No notifications showing**
   - Run the seed script: `npm run seed-notifications`
   - Check user authentication
   - Verify GraphQL queries are working

4. **Frontend build errors**
   - Install Apollo Client dependencies
   - Check TypeScript types
   - Verify import paths

### Debug Commands

```bash
# Check backend logs
npm run dev

# Seed test data
npm run seed-notifications

# Check MongoDB connection
# Verify in config/db.ts
``` 