import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";
import { Announcement } from "../models/Announcement";
import { User } from "../models/User";
import { UserRole } from "../@types/types";

export const createAnnouncement = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    // Notify target audience
    if (announcement.targetAudience.length > 0) {
      const users = await User.find({
        role: { $in: announcement.targetAudience },
      });
      const notifications = users.map((user) => ({
        userId: user._id,
        title: announcement.title,
        message: announcement.content,
        type: announcement.priority === "urgent" ? "warning" : "info",
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  }
);

// Get Announcements
export const getAnnouncements = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { priority, isActive } = req.query;

    const query: any = {};
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === "true";

    // Filter by user role if not admin
    if (req.user?.role !== UserRole.ADMIN) {
      query.targetAudience = req.user?.role;
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  }
);

// Update Announcement
export const updateAnnouncement = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return next(new ErrorHandler("Announcement not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  }
);

// Delete Announcement
export const deleteAnnouncement = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return next(new ErrorHandler("Announcement not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  }
);
