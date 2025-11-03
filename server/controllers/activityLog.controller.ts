import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { ActivityLog } from "../models/ActivityLog";
import { User } from "../models/User";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";

export const getAllActivityLogs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 20,
      userId,
      userRole,
      module,
      action,
      startDate,
      endDate,
    } = req.query;

    const query: any = {};

    if (userId) query.userId = userId;
    if (userRole) query.userRole = userRole;
    if (module) query.module = module;
    if (action) query.action = action;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const activityLogs = await ActivityLog.find(query)
      .populate("userId", "email role")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      activityLogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Activity Log by ID
export const getActivityLog = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const activityLog = await ActivityLog.findById(req.params.id).populate(
      "userId",
      "email role"
    );

    if (!activityLog) {
      return next(new ErrorHandler("Activity log not found", 404));
    }

    res.status(200).json({
      success: true,
      activityLog,
    });
  }
);

// Get User Activity Logs
export const getUserActivityLogs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const query: any = { userId };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const activityLogs = await ActivityLog.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      activityLogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Activity Logs by Module
export const getActivityLogsByModule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { module } = req.params;
    const { page = 1, limit = 20, action } = req.query;

    const query: any = { module };
    if (action) query.action = action;

    const activityLogs = await ActivityLog.find(query)
      .populate("userId", "email role")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      activityLogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Activity Statistics
export const getActivityStatistics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    // Total activities
    const totalActivities = await ActivityLog.countDocuments(query);

    // Activities by module
    const byModule = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$module",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Activities by action
    const byAction = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Activities by user role
    const byUserRole = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$userRole",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          count: 1,
          email: "$user.email",
          role: "$user.role",
        },
      },
    ]);

    // Activity timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const timeline = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalActivities,
        byModule,
        byAction,
        byUserRole,
        mostActiveUsers,
        timeline,
      },
    });
  }
);

// Delete Old Activity Logs (cleanup)
export const deleteOldActivityLogs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { daysOld = 90 } = req.body;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - Number(daysOld));

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: dateThreshold },
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} activity logs older than ${daysOld} days`,
      deletedCount: result.deletedCount,
    });
  }
);

// Export Activity Logs
export const exportActivityLogs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, module, userRole } = req.query;

    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    if (module) query.module = module;
    if (userRole) query.userRole = userRole;

    const activityLogs = await ActivityLog.find(query)
      .populate("userId", "email role")
      .sort({ createdAt: -1 })
      .lean();

    // Format data for export
    const exportData = activityLogs.map((log: any) => ({
      date: log.createdAt,
      user: log.userId?.email || "Unknown",
      role: log.userRole,
      module: log.module,
      action: log.action,
      description: log.description,
      ipAddress: log.ipAddress,
    }));

    res.status(200).json({
      success: true,
      data: exportData,
      total: exportData.length,
    });
  }
);
