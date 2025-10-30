import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Parent } from "../models/Parent";
import { Student } from "../models/Student";
import { User } from "../models/User";
import { ActivityLog } from "../models/ActivityLog";
import { Notification } from "../models/Notification";
import bcrypt from "bcryptjs";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { UserRole } from "../@types/types";
import { Types } from "mongoose";

export const createParent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parentData = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email: parentData.email });
    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // Verify student IDs if provided
    if (parentData.studentIds && parentData.studentIds.length > 0) {
      const students = await Student.find({
        _id: { $in: parentData.studentIds },
      });
      if (students.length !== parentData.studentIds.length) {
        return next(
          new ErrorHandler("One or more student IDs are invalid", 400)
        );
      }
    }

    const user = await User.create({
      email: parentData.email,
      password: parentData.password,
      role: UserRole.PARENT,
    });

    // Create parent profile
    const parent = await Parent.create({
      ...parentData,
      userId: user._id,
      studentIds: parentData.studentIds || [],
    });

    user.profileId = parent._id as Types.ObjectId;
    await user.save();

    // Update students with parent ID
    if (parentData.studentIds && parentData.studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: parentData.studentIds } },
        { $addToSet: { parentIds: parent._id } }
      );
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "PARENT",
      description: `Created parent: ${parent.firstName} ${parent.lastName}`,
    });

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parent,
    });
  }
);

// Get All Parents
export const getAllParents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const parents = await Parent.find(query)
      .populate("studentIds userId")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Parent.countDocuments(query);

    res.status(200).json({
      success: true,
      parents,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Single Parent
export const getParent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parent = await Parent.findById(req.params.id)
      .populate({
        path: "studentIds",
        populate: { path: "classId sectionId" },
      })
      .populate("userId");

    if (!parent) {
      return next(new ErrorHandler("Parent not found", 404));
    }

    res.status(200).json({
      success: true,
      parent,
    });
  }
);

// Update Parent
export const updateParent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!parent) {
      return next(new ErrorHandler("Parent not found", 404));
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "PARENT",
      description: `Updated parent: ${parent.firstName} ${parent.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Parent updated successfully",
      parent,
    });
  }
);

// Delete Parent
export const deleteParent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return next(new ErrorHandler("Parent not found", 404));
    }

    // Remove parent ID from students
    await Student.updateMany(
      { _id: { $in: parent.studentIds } },
      { $pull: { parentIds: parent._id } }
    );

    // Delete user account
    await User.findByIdAndDelete(parent.userId);

    // Delete parent
    await parent.deleteOne();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "DELETE",
      module: "PARENT",
      description: `Deleted parent: ${parent.firstName} ${parent.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Parent deleted successfully",
    });
  }
);

// Link Parent to Student
export const linkToStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parentId, studentId } = req.body;

    const parent = await Parent.findById(parentId);
    const student = await Student.findById(studentId);

    if (!parent) {
      return next(new ErrorHandler("Parent not found", 404));
    }
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    // Check if already linked
    if (parent.studentIds.includes(studentId)) {
      return next(
        new ErrorHandler("Parent already linked to this student", 400)
      );
    }

    // Link parent to student
    parent.studentIds.push(studentId);
    await parent.save();

    // Link student to parent
    student.parentIds.push(parentId);
    await student.save();

    // Notify parent
    await Notification.create({
      userId: parent.userId,
      title: "Student Linked",
      message: `You have been linked to student: ${student.firstName} ${student.lastName}`,
      type: "info",
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "LINK",
      module: "PARENT",
      description: `Linked parent ${parent.firstName} to student ${student.firstName}`,
    });

    res.status(200).json({
      success: true,
      message: "Parent linked to student successfully",
      parent,
    });
  }
);

// Unlink Parent from Student
export const unlinkFromStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parentId, studentId } = req.body;

    const parent = await Parent.findById(parentId);
    const student = await Student.findById(studentId);

    if (!parent) {
      return next(new ErrorHandler("Parent not found", 404));
    }
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    // Unlink parent from student
    parent.studentIds = parent.studentIds.filter(
      (id) => id.toString() !== studentId
    );
    await parent.save();

    // Unlink student from parent
    student.parentIds = student.parentIds.filter(
      (id) => id.toString() !== parentId
    );
    await student.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UNLINK",
      module: "PARENT",
      description: `Unlinked parent ${parent.firstName} from student ${student.firstName}`,
    });

    res.status(200).json({
      success: true,
      message: "Parent unlinked from student successfully",
      parent,
    });
  }
);

// Get Parent's Children Information
export const getChildrenInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parent = await Parent.findOne({ userId: req.user?._id });

    if (!parent) {
      return next(new ErrorHandler("Parent profile not found", 404));
    }

    const children = await Student.find({
      _id: { $in: parent.studentIds },
    })
      .populate("classId sectionId")
      .select("-userId");

    res.status(200).json({
      success: true,
      children,
    });
  }
);

// Get Child's Attendance (for parent)
export const getChildAttendance = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify parent has access to this student
    const parent = await Parent.findOne({ userId: req.user?._id });
    if (!parent || !parent.studentIds.includes(studentId as any)) {
      return next(
        new ErrorHandler("Unauthorized to view this student's data", 403)
      );
    }

    const { Attendance } = require("../models/Attendance");

    const query: any = { studentId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter(
      (a: any) => a.status === "present"
    ).length;
    const absent = attendance.filter((a: any) => a.status === "absent").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      report: {
        total,
        present,
        absent,
        percentage,
      },
      attendance,
    });
  }
);

// Get Child's Results (for parent)
export const getChildResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;

    // Verify parent has access to this student
    const parent = await Parent.findOne({ userId: req.user?._id });
    if (!parent || !parent.studentIds.includes(studentId as any)) {
      return next(
        new ErrorHandler("Unauthorized to view this student's data", 403)
      );
    }

    const { Result } = require("../models/Result");

    const results = await Result.find({ studentId })
      .populate("examId subjectId teacherId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  }
);

// Get Child's Fee Summary (for parent)
export const getChildFeeSummary = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;

    // Verify parent has access to this student
    const parent = await Parent.findOne({ userId: req.user?._id });
    if (!parent || !parent.studentIds.includes(studentId as any)) {
      return next(
        new ErrorHandler("Unauthorized to view this student's data", 403)
      );
    }

    const { FeePayment } = require("../models/FeePayment");

    const payments = await FeePayment.find({ studentId }).populate(
      "feeStructureId"
    );

    const totalPaid = payments
      .filter((p: { status: string }) => p.status === "paid")
      .reduce((sum: number, p: any) => sum + (p.amountPaid ?? 0), 0);

    const pending = payments.filter(
      (p: { status: string }) =>
        p.status === "pending" || p.status === "overdue"
    );

    res.status(200).json({
      success: true,
      summary: {
        totalPaid,
        pendingPayments: pending.length,
        payments,
      },
    });
  }
);
