import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { Class } from "../models/Class";
import { Attendance } from "../models/Attendance";
import { FeePayment } from "../models/FeePayment";
import { ActivityLog } from "../models/ActivityLog";
import ErrorHandler from "../utils/errorHandler";
import { Subject } from "../models/Subject";
import { Timetable } from "../models/TimeTable";
import { HomeworkSubmission } from "../models/HomeworkSubmission";
import { Homework } from "../models/Homework";

export const getAdminDashboard = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalStudents = await Student.countDocuments({ status: "active" });
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.countDocuments({
      date: today,
      status: "present",
    });

    const pendingFees = await FeePayment.countDocuments({
      status: { $in: ["pending", "overdue"] },
    });

    const recentActivities = await ActivityLog.find()
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      dashboard: {
        totalStudents,
        totalTeachers,
        totalClasses,
        todayAttendance,
        pendingFees,
        recentActivities,
      },
    });
  }
);

// Teacher Dashboard
export const getTeacherDashboard = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const teacher = await Teacher.findOne({ userId: req.user?._id });
    if (!teacher) {
      return next(new ErrorHandler("Teacher profile not found", 404));
    }

    const myClasses = await Class.find({ _id: { $in: teacher.classes } });
    const mySubjects = await Subject.find({ _id: { $in: teacher.subjects } });

    const today = new Date();
    const todayTimetable = await Timetable.find({
      "schedule.periods.teacherId": teacher._id,
    }).populate("classId sectionId");

    const pendingHomework = await HomeworkSubmission.countDocuments({
      status: "submitted",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        myClasses,
        mySubjects,
        todayTimetable,
        pendingHomework,
      },
    });
  }
);

// Student Dashboard
export const getStudentDashboard = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await Student.findOne({ userId: req.user?._id }).populate(
      "classId sectionId"
    );
    if (!student) {
      return next(new ErrorHandler("Student profile not found", 404));
    }

    const timetable = await Timetable.findOne({
      classId: student.classId,
      sectionId: student.sectionId,
    });

    const homework = await Homework.find({
      classId: student.classId,
      sectionId: student.sectionId,
    })
      .sort({ dueDate: 1 })
      .limit(5);

    const attendanceStats = await Attendance.aggregate([
      { $match: { studentId: student._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        student,
        timetable,
        homework,
        attendanceStats,
      },
    });
  }
);
