import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Subject } from "../models/Subject";
import { Teacher } from "../models/Teacher";

export const createSubject = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  }
);

// Get Subjects
export const getSubjects = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;

    const subjects = await Subject.find(query).populate("classId teacherId");

    res.status(200).json({
      success: true,
      subjects,
    });
  }
);

// Assign Teacher to Subject
export const assignTeacher = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subjectId } = req.params;
    const { teacherId } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { teacherId },
      { new: true }
    );

    if (!subject) {
      return next(new ErrorHandler("Subject not found", 404));
    }

    // Update teacher's subjects
    await Teacher.findByIdAndUpdate(teacherId, {
      $addToSet: { subjects: subjectId },
    });

    res.status(200).json({
      success: true,
      message: "Teacher assigned successfully",
      subject,
    });
  }
);
