import Notification from '../models/Notification';

const notificationResolvers = {
  Query: {
    notifications: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error('Not authenticated');
      return Notification.find({ user: user._id }).sort({ createdAt: -1 });
    },
    latestNotifications: async (_: any, { limit = 3 }: any, { user }: any) => {
      if (!user) throw new Error('Not authenticated');
      return Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(limit);
    },
  },
  Mutation: {
    createNotification: async (_: any, { message, user, type }: any) => {
      const notification = await Notification.create({ message, user, type });
      return notification;
    },
    markNotificationRead: async (_: any, { id }: any, { user }: any) => {
      if (!user) throw new Error('Not authenticated');
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: user._id },
        { read: true },
        { new: true }
      );
      if (!notification) throw new Error('Notification not found');
      return notification;
    },
  },
};

export default notificationResolvers; 