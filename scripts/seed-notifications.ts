import mongoose from 'mongoose';
import config from '../src/config/db';
import Notification from '../src/models/Notification';
import User from '../src/models/User';

const seedNotifications = async () => {
  try {
    // Connect to MongoDB
    await config.dbConnection();
    
    // Get some test users
    const users = await User.find().limit(3);
    
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }

    // Sample notifications
    const sampleNotifications = [
      {
        message: 'Welcome to the EMR system! Your account has been successfully created.',
        type: 'success',
        read: false,
      },
      {
        message: 'New patient appointment scheduled for tomorrow at 10:00 AM.',
        type: 'info',
        read: false,
      },
      {
        message: 'System maintenance scheduled for tonight at 2:00 AM.',
        type: 'warning',
        read: false,
      },
      {
        message: 'Lab results are now available for patient ID: 12345.',
        type: 'info',
        read: true,
      },
      {
        message: 'Payment received for invoice #INV-2024-001.',
        type: 'success',
        read: false,
      },
      {
        message: 'Critical alert: Patient vitals require immediate attention.',
        type: 'error',
        read: false,
      },
    ];

    // Create notifications for each user
    for (const user of users) {
      for (const notificationData of sampleNotifications) {
        await Notification.create({
          ...notificationData,
          user: user._id,
        });
      }
    }

    console.log(`✅ Successfully created ${sampleNotifications.length * users.length} notifications for ${users.length} users`);
    
    // Display summary
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });
    
    console.log(`📊 Total notifications: ${totalNotifications}`);
    console.log(`📊 Unread notifications: ${unreadNotifications}`);

  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seed function
seedNotifications(); 