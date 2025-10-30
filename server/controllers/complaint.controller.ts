import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { Complaint } from "../models/Complaint";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { ActivityLog } from "../models/ActivityLog";
import ErrorHandler from "../utils/errorHandler";

export const submitComplaint = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, subject, description, priority } = req.body;

    const complaint = await Complaint.create({
      submittedBy: req.user?._id,
      submitterRole: req.user?.role,
      category,
      subject,
      description,
      priority: priority || "medium",
      status: "open",
    });

    // Notify admins
    const admins = await User.find({
      role: { $in: ["admin", "principal"] },
    });

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title: "New Complaint",
      message: `New ${category} complaint: ${subject}`,
      type: "warning",
      link: `/complaints/${complaint._id}`,
    }));

    await Notification.insertMany(notifications);

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "SUBMIT",
      module: "COMPLAINT",
      description: `Submitted complaint: ${subject}`,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  }
);

// Get All Complaints
export const getAllComplaints = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, status, category, priority } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate("submittedBy assignedTo")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      success: true,
      complaints,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get My Complaints
export const getMyComplaints = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const complaints = await Complaint.find({
      submittedBy: req.user?._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  }
);

// Get Single Complaint
export const getComplaint = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const complaint = await Complaint.findById(req.params.id).populate(
      "submittedBy assignedTo"
    );

    if (!complaint) {
      return next(new ErrorHandler("Complaint not found", 404));
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  }
);

// Assign Complaint
export const assignComplaint = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { complaintId, assignedTo } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedTo, status: "in_progress" },
      { new: true }
    );

    if (!complaint) {
      return next(new ErrorHandler("Complaint not found", 404));
    }

    // Notify assigned person
    await Notification.create({
      userId: assignedTo,
      title: "Complaint Assigned",
      message: `A complaint has been assigned to you: ${complaint.subject}`,
      type: "info",
      link: `/complaints/${complaint._id}`,
    });

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint,
    });
  }
);

// Update Complaint Status
export const updateComplaintStatus = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, resolution } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolution,
        ...(status === "resolved" && { resolvedDate: new Date() }),
      },
      { new: true }
    );

    if (!complaint) {
      return next(new ErrorHandler("Complaint not found", 404));
    }

    // Notify submitter
    await Notification.create({
      userId: complaint.submittedBy,
      title: "Complaint Updated",
      message: `Your complaint status has been updated to: ${status}`,
      type: "info",
      link: `/complaints/${complaint._id}`,
    });

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  }
);

// Delete Complaint
export const deleteComplaint = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return next(new ErrorHandler("Complaint not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  }
);
