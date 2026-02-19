import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";
import { INotificationQuery } from "./notification.interface";

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const query = req.query as INotificationQuery;

  const result = await NotificationService.getUserNotifications(userId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const result = await NotificationService.markNotificationAsRead(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read successfully",
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await NotificationService.markAllNotificationsAsRead(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read successfully",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const result = await NotificationService.deleteNotification(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await NotificationService.deleteAllNotifications(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications deleted successfully",
    data: result,
  });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await NotificationService.getUnreadCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unread count retrieved successfully",
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
};
