import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { FeeStructure } from "../models/Fees";
import { FeePayment } from "../models/FeePayment";
import { Student } from "../models/Student";
import { Notification } from "../models/Notification";
import { Parent } from "../models/Parent";

export const createFeeStructure = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const feeStructure = await FeeStructure.create(req.body);

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      feeStructure,
    });
  }
);

// Get Fee Structures
export const getFeeStructures = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, academicYearId } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;
    if (academicYearId) query.academicYearId = academicYearId;

    const feeStructures = await FeeStructure.find(query).populate(
      "classId academicYearId"
    );

    res.status(200).json({
      success: true,
      feeStructures,
    });
  }
);

// Record Fee Payment
export const recordPayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentData = {
      ...req.body,
      receivedBy: req.user?._id,
    };

    const payment = await FeePayment.create(paymentData);

    // Send notification to student/parent
    const student = await Student.findById(paymentData.studentId);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: "Fee Payment Received",
        message: `Payment of ${paymentData.amountPaid} received successfully`,
        type: "success",
      });

      // Notify parents
      for (const parentId of student.parentIds) {
        const parent = await Parent.findById(parentId);
        if (parent) {
          await Notification.create({
            userId: parent.userId,
            title: "Fee Payment Received",
            message: `Payment of ${paymentData.amountPaid} received for ${student.firstName}`,
            type: "success",
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  }
);

// Get Fee Payments
export const getFeePayments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, status, startDate, endDate } = req.query;

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const payments = await FeePayment.find(query)
      .populate("studentId feeStructureId receivedBy")
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  }
);

// Get Student Fee Summary
export const getStudentFeeSummary = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    const payments = await FeePayment.find({ studentId }).populate(
      "feeStructureId"
    );

    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDue = payments
      .filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      summary: {
        totalPaid,
        totalDue,
        payments,
      },
    });
  }
);
