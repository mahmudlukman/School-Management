import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Timetable } from "../models/TimeTable";

export const upsertTimetable = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, academicYearId, schedule } = req.body;

    const timetable = await Timetable.findOneAndUpdate(
      { classId, sectionId, academicYearId },
      { schedule },
      { upsert: true, new: true }
    ).populate("classId sectionId academicYearId");

    res.status(200).json({
      success: true,
      message: "Timetable saved successfully",
      timetable,
    });
  }
);

// Get Timetable
export const getTimetable = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, sectionId, academicYearId } = req.query;

    const timetable = await Timetable.findOne({
      classId,
      sectionId,
      academicYearId,
    }).populate({
      path: "schedule.periods.subjectId schedule.periods.teacherId",
    });

    if (!timetable) {
      return next(new ErrorHandler("Timetable not found", 404));
    }

    res.status(200).json({
      success: true,
      timetable,
    });
  }
);

// Get Teacher Timetable
export const getTeacherTimetable = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teacherId, academicYearId } = req.query;

    const timetables = await Timetable.find({
      academicYearId,
      "schedule.periods.teacherId": teacherId,
    }).populate("classId sectionId");

    res.status(200).json({
      success: true,
      timetables,
    });
  }
);
