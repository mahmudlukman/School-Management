import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Certificate } from "../models/Certificate";
import { Student } from "../models/Student";
import { ActivityLog } from "../models/ActivityLog";
import { Notification } from "../models/Notification";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";

export const issueCertificate = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, certificateType, purpose, content } = req.body;

    const student = await Student.findById(studentId).populate("classId");

    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    // Generate unique certificate number
    const count = await Certificate.countDocuments();
    const certificateNumber = `CERT${new Date().getFullYear()}${String(
      count + 1
    ).padStart(5, "0")}`;

    const certificate = await Certificate.create({
      studentId,
      certificateType,
      issueDate: new Date(),
      certificateNumber,
      purpose,
      issuedBy: req.user?._id,
      content,
      status: "active",
    });

    // Notify student
    await Notification.create({
      userId: student.userId,
      title: "Certificate Issued",
      message: `Your ${certificateType} certificate has been issued`,
      type: "success",
    });

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "ISSUE",
      module: "CERTIFICATE",
      description: `Issued ${certificateType} certificate for ${student.firstName} ${student.lastName}`,
    });

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      certificate,
    });
  }
);

// Get All Certificates
export const getAllCertificates = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      studentId,
      certificateType,
      status,
    } = req.query;

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (certificateType) query.certificateType = certificateType;
    if (status) query.status = status;

    const certificates = await Certificate.find(query)
      .populate("studentId issuedBy")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ issueDate: -1 });

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      certificates,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Single Certificate
export const getCertificate = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const certificate = await Certificate.findById(req.params.id).populate(
      "studentId issuedBy"
    );

    if (!certificate) {
      return next(new ErrorHandler("Certificate not found", 404));
    }

    res.status(200).json({
      success: true,
      certificate,
    });
  }
);

// Get Certificate by Number
export const getCertificateByNumber = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { certificateNumber } = req.params;

    const certificate = await Certificate.findOne({
      certificateNumber,
    }).populate("studentId issuedBy");

    if (!certificate) {
      return next(new ErrorHandler("Certificate not found", 404));
    }

    res.status(200).json({
      success: true,
      certificate,
    });
  }
);

// Revoke Certificate
export const revokeCertificate = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: "revoked" },
      { new: true }
    );

    if (!certificate) {
      return next(new ErrorHandler("Certificate not found", 404));
    }

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "REVOKE",
      module: "CERTIFICATE",
      description: `Revoked certificate: ${certificate.certificateNumber}`,
    });

    res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
      certificate,
    });
  }
);

// Get Student Certificates
export const getStudentCertificates = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;

    const certificates = await Certificate.find({ studentId }).sort({
      issueDate: -1,
    });

    res.status(200).json({
      success: true,
      certificates,
    });
  }
);
