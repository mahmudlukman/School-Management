import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { Class } from "../models/Class";
import { Section } from "../models/Section";
import { Teacher } from "../models/Teacher";
import ErrorHandler from "../utils/errorHandler";

export const createClass = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const classData = await Class.create(req.body);

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: classData,
    });
  }
);

// Get All Classes
export const getAllClasses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const classes = await Class.find()
      .populate("classTeacherId academicYearId")
      .sort({ level: 1 });

    res.status(200).json({
      success: true,
      classes,
    });
  }
);

// Create Section
export const createSection = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const section = await Section.create(req.body);

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      section,
    });
  }
);

// Get Sections by Class
export const getSectionsByClass = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.params;

    const sections = await Section.find({ classId }).populate("classTeacherId");

    res.status(200).json({
      success: true,
      sections,
    });
  }
);

// Assign Teacher to Class
export const assignClassTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const { classTeacherId } = req.body;

    const classData = await Class.findByIdAndUpdate(
      classId,
      { classTeacherId },
      { new: true }
    );

    if (!classData) {
      return next(new ErrorHandler("Class not found", 404));
    }

    // Update teacher's subjects
    await Teacher.findByIdAndUpdate(classTeacherId, {
      $addToSet: { class: classId },
    });

    res.status(200).json({
      success: true,
      message: "Teacher assigned successfully",
      classData,
    });
  }
);

