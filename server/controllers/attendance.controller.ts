import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Attendance } from "../models/Attendance";
import { ActivityLog } from "../models/ActivityLog";

export const markAttendance = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { attendanceRecords, classId, sectionId, date } = req.body;

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      classId,
      sectionId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return next(
        new ErrorHandler("Attendance already marked for this date", 400)
      );
    }

    const attendanceData = attendanceRecords.map((record: any) => ({
      ...record,
      classId,
      sectionId,
      date: new Date(date),
      markedBy: req.user?._id,
    }));

    const attendance = await Attendance.insertMany(attendanceData);

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "MARK",
      module: "ATTENDANCE",
      description: `Marked attendance for ${attendanceRecords.length} students`,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  }
);

// Get Attendance by Class/Section/Date
export const getAttendance = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, date, startDate, endDate } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (date) query.date = new Date(date as string);
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("studentId markedBy")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      attendance,
    });
  }
);

// Get Student Attendance Report
export const getStudentAttendanceReport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, startDate, endDate } = req.query;

    const attendance = await Attendance.find({
      studentId,
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    }).sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const excused = attendance.filter((a) => a.status === "excused").length;

    res.status(200).json({
      success: true,
      report: {
        total,
        present,
        absent,
        late,
        excused,
        percentage: ((present / total) * 100).toFixed(2),
      },
      attendance,
    });
  }
);

// Update Attendance
export const updateAttendance = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return next(new ErrorHandler("Attendance record not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  }
);
