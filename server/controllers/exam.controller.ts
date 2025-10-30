import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Exam } from "../models/Examination";
import { ActivityLog } from "../models/ActivityLog";
import { ExamSchedule } from "../models/ExamSchedule";
import { Result } from "../models/Result";
import { Student } from "../models/Student";
import { Notification } from "../models/Notification";

export const createExam = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam = await Exam.create(req.body);

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "EXAM",
      description: `Created exam: ${exam.name}`,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  }
);

// Get All Exams
export const getAllExams = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, academicYearId, type } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;
    if (academicYearId) query.academicYearId = academicYearId;
    if (type) query.type = type;

    const exams = await Exam.find(query)
      .populate("classId academicYearId")
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      exams,
    });
  }
);

// Create Exam Schedule
export const createExamSchedule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const schedule = await ExamSchedule.create(req.body);

    res.status(201).json({
      success: true,
      message: "Exam schedule created successfully",
      schedule,
    });
  }
);

// Get Exam Schedule
export const getExamSchedule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { examId } = req.params;

    const schedule = await ExamSchedule.find({ examId })
      .populate("subjectId")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      schedule,
    });
  }
);

// Add Result
export const addResult = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const resultData = req.body;

    // Check if result already exists
    const existingResult = await Result.findOne({
      studentId: resultData.studentId,
      examId: resultData.examId,
      subjectId: resultData.subjectId,
    });

    if (existingResult) {
      return next(
        new ErrorHandler("Result already exists for this student", 400)
      );
    }

    // Calculate grade
    const percentage = (resultData.marksObtained / resultData.maxMarks) * 100;
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    const result = await Result.create({
      ...resultData,
      grade,
      teacherId: req.user?._id,
    });

    // Send notification to student
    const student = await Student.findById(resultData.studentId);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: "Result Published",
        message: `Your result for exam has been published`,
        type: "info",
      });
    }

    res.status(201).json({
      success: true,
      message: "Result added successfully",
      result,
    });
  }
);

// Get Results
export const getResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { examId, studentId, subjectId } = req.query;

    const query: any = {};
    if (examId) query.examId = examId;
    if (studentId) query.studentId = studentId;
    if (subjectId) query.subjectId = subjectId;

    const results = await Result.find(query)
      .populate("studentId examId subjectId teacherId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  }
);
