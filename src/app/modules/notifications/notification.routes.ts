import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { NotificationController } from "./notification.controller";

const router = express.Router();

// Get all notifications for authenticated user
router.get(
  "/get-all-notifications",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.getAllNotifications
);

// Mark a specific notification as read
router.patch(
  "/mark-as-read/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.markAsRead
);

// Mark all notifications as read
router.patch(
  "/mark-all-as-read",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.markAllAsRead
);

// Delete a specific notification
router.delete(
  "/delete/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.deleteNotification
);

// Delete all notifications
router.delete(
  "/delete-all",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.deleteAllNotifications
);

// Get unread count
router.get(
  "/unread-count",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.consultant,
    USER_ROLE.buyer
  ),
  NotificationController.getUnreadCount
);

export const NotificationRoutes = router;
