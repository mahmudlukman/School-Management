import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { AcademicYear } from "../models/AcademicYear";
import { Class } from "../models/Class";
import { ActivityLog } from "../models/ActivityLog";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";

export const createAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { year, startDate, endDate, isCurrent } = req.body;

    // Check if academic year already exists
    const existingYear = await AcademicYear.findOne({ year });
    if (existingYear) {
      return next(new ErrorHandler("Academic year already exists", 400));
    }

    // If setting as current, unset other current years
    if (isCurrent) {
      await AcademicYear.updateMany({ isCurrent: true }, { isCurrent: false });
    }

    const academicYear = await AcademicYear.create({
      year,
      startDate,
      endDate,
      isCurrent,
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "ACADEMIC_YEAR",
      description: `Created academic year: ${year}`,
    });

    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      academicYear,
    });
  }
);

// Get All Academic Years
export const getAllAcademicYears = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const academicYears = await AcademicYear.find().sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      academicYears,
    });
  }
);

// Get Current Academic Year
export const getCurrentAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const academicYear = await AcademicYear.findOne({ isCurrent: true });

    if (!academicYear) {
      return next(new ErrorHandler("No current academic year set", 404));
    }

    res.status(200).json({
      success: true,
      academicYear,
    });
  }
);

// Get Single Academic Year
export const getAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return next(new ErrorHandler("Academic year not found", 404));
    }

    res.status(200).json({
      success: true,
      academicYear,
    });
  }
);

// Update Academic Year
export const updateAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { isCurrent } = req.body;

    // If setting as current, unset other current years
    if (isCurrent) {
      await AcademicYear.updateMany(
        { isCurrent: true, _id: { $ne: req.params.id } },
        { isCurrent: false }
      );
    }

    const academicYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!academicYear) {
      return next(new ErrorHandler("Academic year not found", 404));
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "ACADEMIC_YEAR",
      description: `Updated academic year: ${academicYear.year}`,
    });

    res.status(200).json({
      success: true,
      message: "Academic year updated successfully",
      academicYear,
    });
  }
);

// Delete Academic Year
export const deleteAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return next(new ErrorHandler("Academic year not found", 404));
    }

    // Check if academic year is being used
    const classesUsingYear = await Class.countDocuments({
      academicYearId: req.params.id,
    });

    if (classesUsingYear > 0) {
      return next(
        new ErrorHandler(
          "Cannot delete academic year. It is being used by classes.",
          400
        )
      );
    }

    await academicYear.deleteOne();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "DELETE",
      module: "ACADEMIC_YEAR",
      description: `Deleted academic year: ${academicYear.year}`,
    });

    res.status(200).json({
      success: true,
      message: "Academic year deleted successfully",
    });
  }
);

// Set Current Academic Year
export const setCurrentAcademicYear = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Unset all current years
    await AcademicYear.updateMany({ isCurrent: true }, { isCurrent: false });

    // Set the specified year as current
    const academicYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      { isCurrent: true },
      { new: true }
    );

    if (!academicYear) {
      return next(new ErrorHandler("Academic year not found", 404));
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "ACADEMIC_YEAR",
      description: `Set ${academicYear.year} as current academic year`,
    });

    res.status(200).json({
      success: true,
      message: "Current academic year set successfully",
      academicYear,
    });
  }
);
