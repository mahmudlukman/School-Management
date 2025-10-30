import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { Message } from "../models/Message";

export const sendMessage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipientId, subject, message, attachments, parentMessageId } =
      req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new ErrorHandler("Recipient not found", 404));
    }

    const newMessage = await Message.create({
      senderId: req.user?._id,
      senderRole: req.user?.role,
      recipientId,
      recipientRole: recipient.role,
      subject,
      message,
      attachments,
      parentMessageId,
    });

    // Notify recipient
    await Notification.create({
      userId: recipientId,
      title: "New Message",
      message: `You have a new message: ${subject}`,
      type: "info",
      link: `/messages/${newMessage._id}`,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  }
);

// Get Inbox
export const getInbox = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find({ recipientId: req.user?._id })
      .populate("senderId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  }
);

// Get Sent Messages
export const getSentMessages = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find({ senderId: req.user?._id })
      .populate("recipientId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  }
);

// Mark Message as Read
export const markMessageAsRead = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      return next(new ErrorHandler("Message not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  }
);
