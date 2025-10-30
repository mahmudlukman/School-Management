import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Transport } from "../models/Transport";
import { TransportAssignment } from "../models/TransportAssignment";
import { Student } from "../models/Student";
import { ActivityLog } from "../models/ActivityLog";
import { Notification } from "../models/Notification";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";

export const createTransport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if vehicle number exists
    const existingVehicle = await Transport.findOne({
      vehicleNumber: req.body.vehicleNumber,
    });

    if (existingVehicle) {
      return next(new ErrorHandler("Vehicle number already exists", 400));
    }

    const transport = await Transport.create(req.body);

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "TRANSPORT",
      description: `Created transport vehicle: ${transport.vehicleNumber}`,
    });

    res.status(201).json({
      success: true,
      message: "Transport created successfully",
      transport,
    });
  }
);

// Get All Transports
export const getAllTransports = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { isActive, vehicleType, search } = req.query;

    const query: any = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (vehicleType) query.vehicleType = vehicleType;
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: "i" } },
        { routeName: { $regex: search, $options: "i" } },
        { driverName: { $regex: search, $options: "i" } },
      ];
    }

    const transports = await Transport.find(query).sort({ routeNumber: 1 });

    res.status(200).json({
      success: true,
      transports,
    });
  }
);

// Get Single Transport
export const getTransport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return next(new ErrorHandler("Transport not found", 404));
    }

    // Get assigned students
    const assignments = await TransportAssignment.find({
      transportId: req.params.id,
      isActive: true,
    }).populate("studentId", "firstName lastName admissionNumber");

    res.status(200).json({
      success: true,
      transport,
      assignedStudents: assignments,
    });
  }
);

// Update Transport
export const updateTransport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const transport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!transport) {
      return next(new ErrorHandler("Transport not found", 404));
    }

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "TRANSPORT",
      description: `Updated transport: ${transport.vehicleNumber}`,
    });

    res.status(200).json({
      success: true,
      message: "Transport updated successfully",
      transport,
    });
  }
);

// Delete Transport
export const deleteTransport = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return next(new ErrorHandler("Transport not found", 404));
    }

    // Check if transport has active assignments
    const activeAssignments = await TransportAssignment.countDocuments({
      transportId: req.params.id,
      isActive: true,
    });

    if (activeAssignments > 0) {
      return next(
        new ErrorHandler(
          "Cannot delete transport with active student assignments",
          400
        )
      );
    }

    await transport.deleteOne();

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "DELETE",
      module: "TRANSPORT",
      description: `Deleted transport: ${transport.vehicleNumber}`,
    });

    res.status(200).json({
      success: true,
      message: "Transport deleted successfully",
    });
  }
);

// Assign Student to Transport
export const assignStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, transportId, pickupPoint, monthlyFee, startDate } =
      req.body;

    const student = await Student.findById(studentId);
    const transport = await Transport.findById(transportId);

    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }
    if (!transport) {
      return next(new ErrorHandler("Transport not found", 404));
    }

    // Check if student already has active transport
    const existingAssignment = await TransportAssignment.findOne({
      studentId,
      isActive: true,
    });

    if (existingAssignment) {
      return next(
        new ErrorHandler("Student already assigned to a transport", 400)
      );
    }

    // Check transport capacity
    const currentAssignments = await TransportAssignment.countDocuments({
      transportId,
      isActive: true,
    });

    if (currentAssignments >= transport.capacity) {
      return next(new ErrorHandler("Transport is at full capacity", 400));
    }

    const assignment = await TransportAssignment.create({
      studentId,
      transportId,
      pickupPoint,
      monthlyFee,
      startDate,
      isActive: true,
    });

    // Notify student
    await Notification.create({
      userId: student.userId,
      title: "Transport Assigned",
      message: `You have been assigned to ${transport.routeName} - ${transport.vehicleNumber}`,
      type: "info",
    });

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "ASSIGN",
      module: "TRANSPORT",
      description: `Assigned student ${student.firstName} to transport ${transport.vehicleNumber}`,
    });

    res.status(201).json({
      success: true,
      message: "Student assigned to transport successfully",
      assignment,
    });
  }
);

// Unassign Student from Transport
export const unassignStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { assignmentId } = req.params;

    const assignment = await TransportAssignment.findByIdAndUpdate(
      assignmentId,
      { isActive: false, endDate: new Date() },
      { new: true }
    );

    if (!assignment) {
      return next(new ErrorHandler("Assignment not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Student unassigned from transport successfully",
      assignment,
    });
  }
);

// Get Transport Assignments
export const getTransportAssignments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { transportId, studentId, isActive } = req.query;

    const query: any = {};
    if (transportId) query.transportId = transportId;
    if (studentId) query.studentId = studentId;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const assignments = await TransportAssignment.find(query)
      .populate("studentId transportId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assignments,
    });
  }
);
