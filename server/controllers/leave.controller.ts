import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";
import { Leave } from "../models/Leave";
import { User } from "../models/User";
import { UserRole } from "../@types/types";

export const applyLeave = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const leave = await Leave.create({
      ...req.body,
      userId: req.user?._id,
      userRole: req.user?.role,
    });

    // Notify admin/principal
    const admins = await User.find({
      role: { $in: [UserRole.ADMIN, UserRole.PRINCIPAL] },
    });

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title: "New Leave Application",
      message: `${req.user?.role} has applied for leave`,
      type: "info",
      link: `/leaves/${leave._id}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      leave,
    });
  }
);

// Get Leaves
export const getLeaves = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, userRole, userId } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (userRole) query.userRole = userRole;
    if (userId) query.userId = userId;

    const leaves = await Leave.find(query)
      .populate("userId approvedBy")
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      leaves,
    });
  }
);

// Approve/Reject Leave
export const updateLeaveStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { leaveId } = req.params;
    const { status, remarks } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status,
        remarks,
        approvedBy: req.user?._id,
        approvedDate: new Date(),
      },
      { new: true }
    ).populate("userId");

    if (!leave) {
      return next(new ErrorHandler("Leave not found", 404));
    }

    // Notify user
    const user = leave.userId as any;
    await Notification.create({
      userId: user._id,
      title: `Leave ${status}`,
      message: `Your leave application has been ${status}`,
      type: status === "approved" ? "success" : "warning",
    });

    res.status(200).json({
      success: true,
      message: `Leave ${status} successfully`,
      leave,
    });
  }
);
