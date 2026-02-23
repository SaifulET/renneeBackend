import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Notification } from "./notification.model";
import { INotification, INotificationQuery } from "./notification.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import users from "../user/user.model";
import { USER_ROLE } from "../user/user.constant";

const createNotification = async (
  recipientId: string,
  title: string,
  message: string,
  type: 'booking' | 'message' | 'system' | 'general' = 'general',
  options: {
    senderId?: string;
    relatedId?: string;
    priority?: 'low' | 'medium' | 'high';
    actionUrl?: string;
    metadata?: Record<string, any>;
  } = {}
) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: options.senderId,
      title,
      message,
      type,
      relatedId: options.relatedId,
      priority: options.priority || 'medium',
      actionUrl: options.actionUrl,
      metadata: options.metadata || {}
    });

    // Send push notification if user has FCM token
    const user = await users.findById(recipientId);
    if (user?.fcm) {
      const { sendPushNotification } = await import("../../utils/notification.helper");
      await sendPushNotification(user.fcm, title, message);
    }

    // Send real-time notification via socket
    const io = (global as any).io;
    if (io) {
      io.to(`user_${recipientId}`).emit("new_notification", notification);
    }

    return notification;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create notification",
      (error as Error).message
    );
  }
};

const getUserNotifications = async (userId: string, query: INotificationQuery) => {
  try {
    const { page = 1, limit = 10, searchTerm, type, priority, isRead } = query;
    
    const messageQuery = new QueryBuilder(
      Notification.find({ recipient: userId }),
      query
    )
      .search(['title', 'message']) // Search in title and message
      .filter()
      .sort() // Default sort by createdAt
      .paginate()
      .fields();

    // Add custom filters
    const matchQuery: any = { recipient: userId };
    
    if (type) {
      matchQuery.type = type;
    }
    
    if (priority) {
      matchQuery.priority = priority;
    }
    
    if (typeof isRead === 'boolean') {
      matchQuery.isRead = isRead;
    }

    const notifications = await messageQuery.modelQuery
      .populate('sender', 'fullname email photo')
      .populate('recipient', 'fullname email photo')
      .sort({ createdAt: -1, priority: -1 }); // Show newest and highest priority first

    const meta = await messageQuery.countTotal();

    return {
      meta,
      data: notifications
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get notifications",
      (error as Error).message
    );
  }
};

const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Notification not found or access denied"
      );
    }

    return notification;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to mark notification as read",
      (error as Error).message
    );
  }
};

const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    return {
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} notifications marked as read`
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to mark all notifications as read",
      (error as Error).message
    );
  }
};

const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Notification not found or access denied"
      );
    }

    return { success: true, message: "Notification deleted successfully" };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete notification",
      (error as Error).message
    );
  }
};

const deleteAllNotifications = async (userId: string) => {
  try {
    const result = await Notification.deleteMany({ recipient: userId });

    return {
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} notifications deleted successfully`
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete all notifications",
      (error as Error).message
    );
  }
};

const getUnreadCount = async (userId: string) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return { unreadCount: count };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get unread count",
      (error as Error).message
    );
  }
};

// Helper function to send notifications to multiple users
const sendBulkNotifications = async (
  recipientIds: string[],
  title: string,
  message: string,
  type: 'booking' | 'message' | 'system' | 'general' = 'general',
  options: {
    senderId?: string;
    relatedId?: string;
    priority?: 'low' | 'medium' | 'high';
    actionUrl?: string;
    metadata?: Record<string, any>;
  } = {}
) => {
  try {
    const notifications = recipientIds.map(recipientId => ({
      recipient: recipientId,
      sender: options.senderId,
      title,
      message,
      type,
      relatedId: options.relatedId,
      priority: options.priority || 'medium',
      actionUrl: options.actionUrl,
      metadata: options.metadata || {}
    }));

    // Always create database notifications
    const createdNotifications = await Notification.insertMany(notifications);

    // Send real-time notifications via socket
    const io = (global as any).io;
    if (io) {
      createdNotifications.forEach((notif) => {
        io.to(`user_${notif.recipient.toString()}`).emit("new_notification", notif);
      });
    }

    // Send push notifications only to users with FCM tokens
    const usersWithFCM = await users.find({
      _id: { $in: recipientIds },
      fcm: { $exists: true, $ne: null }
    });

    if (usersWithFCM.length > 0) {
      const { sendPushNotification } = await import("../../utils/notification.helper");
      
      for (const user of usersWithFCM) {
        if (user.fcm) {
          await sendPushNotification(user.fcm, title, message);
        }
      }
    }

    return createdNotifications;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send bulk notifications",
      (error as Error).message
    );
  }
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  sendBulkNotifications
};
