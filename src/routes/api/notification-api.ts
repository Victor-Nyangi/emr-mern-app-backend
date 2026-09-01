import express from "express";
import Notification from "../../models/Notification";
import { protect } from "../../middleware/authMiddleware";
import expressAsyncHandler from "express-async-handler";

import { validate } from "../../middleware/validate";
import { createNotificationSchema, idParamSchema } from "../../schemas";

const router = express.Router();

// Get all notifications for the authenticated user
router.get(
  "/",
  protect,
  expressAsyncHandler(async (req, res) => {
    const notifications = await Notification.find({
      user: (req as any).user.id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  }),
);

// Get latest notifications
router.get(
  "/latest",
  protect,
  expressAsyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 3;
    const notifications = await Notification.find({
      user: (req as any).user.id,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(notifications);
  }),
);

// Create a notification
router.post(
  "/",
  protect,
  validate(createNotificationSchema),
  expressAsyncHandler(async (req, res) => {
    // The schema guarantees a non-empty message and fills in the default
    // type, so there is nothing left to check by hand here.
    const { message, type } = req.body;
    const notification = await Notification.create({
      message,
      user: (req as any).user.id,
      type,
      read: false,
    });
    res.status(201).json(notification);
  }),
);

// Mark notification as read
router.patch(
  "/:id/read",
  protect,
  // Without this a non-ObjectId reaches findOneAndUpdate and comes back
  // as a Mongoose CastError naming the internal `_id` field; validating
  // the param rejects it here, before any query is issued.
  validate(idParamSchema, "params"),
  expressAsyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: (req as any).user.id },
      { read: true },
      { new: true },
    );
    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    res.json(notification);
  }),
);

export default router;
