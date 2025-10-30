import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Homework } from "../models/Homework";
import { Student } from "../models/Student";
import { Notification } from "../models/Notification";
import { HomeworkSubmission } from "../models/HomeworkSubmission";

export const createHomework = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const homework = await Homework.create({
      ...req.body,
      teacherId: req.user?._id,
    });

    // Notify students
    const students = await Student.find({
      classId: homework.classId,
      sectionId: homework.sectionId,
    });

    const notifications = students.map((student) => ({
      userId: student.userId,
      title: "New Homework Assigned",
      message: `New homework: ${homework.title}`,
      type: "info",
      link: `/homework/${homework._id}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Homework created successfully",
      homework,
    });
  }
);

// Get Homework
export const getHomework = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, subjectId } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (subjectId) query.subjectId = subjectId;

    const homework = await Homework.find(query)
      .populate("subjectId classId sectionId teacherId")
      .sort({ assignedDate: -1 });

    res.status(200).json({
      success: true,
      homework,
    });
  }
);

// Submit Homework
export const submitHomework = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { homeworkId, content, attachments } = req.body;

    // Get student from user
    const student = await Student.findOne({ userId: req.user?._id });
    if (!student) {
      return next(new ErrorHandler("Student profile not found", 404));
    }

    // Check if already submitted
    const existingSubmission = await HomeworkSubmission.findOne({
      homeworkId,
      studentId: student._id,
    });

    if (existingSubmission) {
      return next(new ErrorHandler("Homework already submitted", 400));
    }

    const homework = await Homework.findById(homeworkId);
    const isLate = new Date() > new Date(homework?.dueDate || "");

    const submission = await HomeworkSubmission.create({
      homeworkId,
      studentId: student._id,
      content,
      attachments,
      submissionDate: new Date(),
      status: isLate ? "late" : "submitted",
    });

    res.status(201).json({
      success: true,
      message: "Homework submitted successfully",
      submission,
    });
  }
);

// Grade Homework
export const gradeHomework = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await HomeworkSubmission.findByIdAndUpdate(
      submissionId,
      {
        marksObtained,
        feedback,
        status: "graded",
      },
      { new: true }
    ).populate("studentId");

    if (!submission) {
      return next(new ErrorHandler("Submission not found", 404));
    }

    // Notify student
    const student = submission.studentId as any;
    await Notification.create({
      userId: student.userId,
      title: "Homework Graded",
      message: `Your homework has been graded. Marks: ${marksObtained}`,
      type: "info",
    });

    res.status(200).json({
      success: true,
      message: "Homework graded successfully",
      submission,
    });
  }
);
