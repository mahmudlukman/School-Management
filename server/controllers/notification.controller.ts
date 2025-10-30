import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";

export const getUserNotifications = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find({ userId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user?._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  }
);

// Mark as Read
export const markAsRead = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  }
);

// Mark All as Read
export const markAllAsRead = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    await Notification.updateMany(
      { userId: req.user?._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  }
);
