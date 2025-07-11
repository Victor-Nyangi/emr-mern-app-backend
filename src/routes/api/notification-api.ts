import express from "express";
import Notification from "../../models/Notification";
import User from "../../models/User";
import { protect } from "../../middleware/authMiddleware";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", protect, expressAsyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: (req as any).user.id })
    .sort({ createdAt: -1 });
  res.json(notifications);
}));

// Get latest notifications
router.get("/latest", protect, expressAsyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 3;
  const notifications = await Notification.find({ user: (req as any).user.id })
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json(notifications);
}));

// Create a notification
router.post("/", protect, expressAsyncHandler(async (req, res) => {
  const { message, type = "info" } = req.body;
  if (!message) {
    res.status(400).json({ message: "Message is required" });
    return;
  }
  const notification = await Notification.create({
    message,
    user: (req as any).user.id,
    type,
    read: false
  });
  res.status(201).json(notification);
}));

// Mark notification as read
router.patch("/:id/read", protect, expressAsyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: (req as any).user.id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }
  res.json(notification);
}));

// Test endpoint to create sample notifications
router.post("/test", expressAsyncHandler(async (req, res) => {
  const users = await User.find().limit(3);
  if (users.length === 0) {
    res.status(400).json({ message: "No users found" });
    return;
  }
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
  const createdNotifications = [];
  for (const user of users) {
    for (const notificationData of sampleNotifications) {
      const notification = await Notification.create({
        ...notificationData,
        user: user._id,
      });
      createdNotifications.push(notification);
    }
  }
  res.json({
    message: `Created ${createdNotifications.length} test notifications`,
    notifications: createdNotifications
  });
}));

export default router; 