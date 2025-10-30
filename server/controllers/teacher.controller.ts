import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Teacher } from "../models/Teacher";
import { User } from "../models/User";
import { UserRole } from "../@types/types";
import { Types } from "mongoose";
import { ActivityLog } from "../models/ActivityLog";

export const createTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, teacherData } = req.body;

    // Check if employee ID exists
    const existingTeacher = await Teacher.findOne({
      employeeId: teacherData.employeeId,
    });
    if (existingTeacher) {
      return next(new ErrorHandler("Employee ID already exists", 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({
      email,
      password,
      role: UserRole.TEACHER,
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      ...teacherData,
      userId: user._id,
    });

    user.profileId = teacher._id as Types.ObjectId;
    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "TEACHER",
      description: `Created teacher: ${teacher.firstName} ${teacher.lastName}`,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  }
);

// Get All Teachers
export const getAllTeachers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await Teacher.find(query)
      .populate("subjects classes")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      teachers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Single Teacher
export const getTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const teacher = await Teacher.findById(req.params.id).populate(
      "subjects classes userId"
    );

    if (!teacher) {
      return next(new ErrorHandler("Teacher not found", 404));
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  }
);

// Update Teacher
export const updateTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return next(new ErrorHandler("Teacher not found", 404));
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "TEACHER",
      description: `Updated teacher: ${teacher.firstName} ${teacher.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  }
);

// Delete Teacher
export const deleteTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return next(new ErrorHandler("Teacher not found", 404));
    }

    // Delete user account
    await User.findByIdAndDelete(teacher.userId);

    // Delete teacher
    await teacher.deleteOne();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "DELETE",
      module: "TEACHER",
      description: `Deleted teacher: ${teacher.firstName} ${teacher.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  }
);
