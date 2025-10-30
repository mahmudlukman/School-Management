import { Hostel } from "../models/Hostel";
import { HostelRoom } from "../models/HostelRoom";
import { HostelAssignment } from "../models/HostelAssignment";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import { ActivityLog } from "../models/ActivityLog";
import ErrorHandler from "../utils/errorHandler";
import { Student } from "../models/Student";
import { Notification } from "../models/Notification";

export const createHostel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostel = await Hostel.create(req.body);

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "HOSTEL",
      description: `Created hostel: ${hostel.name}`,
    });

    res.status(201).json({
      success: true,
      message: "Hostel created successfully",
      hostel,
    });
  }
);

// Get All Hostels
export const getAllHostels = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;

    const query: any = {};
    if (type) query.type = type;

    const hostels = await Hostel.find(query);

    res.status(200).json({
      success: true,
      hostels,
    });
  }
);

// Get Single Hostel
export const getHostel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return next(new ErrorHandler("Hostel not found", 404));
    }

    // Get rooms
    const rooms = await HostelRoom.find({ hostelId: req.params.id });

    res.status(200).json({
      success: true,
      hostel,
      rooms,
    });
  }
);

// Update Hostel
export const updateHostel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hostel) {
      return next(new ErrorHandler("Hostel not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel,
    });
  }
);

// Delete Hostel
export const deleteHostel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return next(new ErrorHandler("Hostel not found", 404));
    }

    // Check if hostel has rooms with students
    const occupiedRooms = await HostelRoom.countDocuments({
      hostelId: req.params.id,
      currentOccupancy: { $gt: 0 },
    });

    if (occupiedRooms > 0) {
      return next(
        new ErrorHandler("Cannot delete hostel with occupied rooms", 400)
      );
    }

    await hostel.deleteOne();

    res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
    });
  }
);

// Create Hostel Room
export const createRoom = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostel = await Hostel.findById(req.body.hostelId);

    if (!hostel) {
      return next(new ErrorHandler("Hostel not found", 404));
    }

    // Check if room number exists in this hostel
    const existingRoom = await HostelRoom.findOne({
      hostelId: req.body.hostelId,
      roomNumber: req.body.roomNumber,
    });

    if (existingRoom) {
      return next(
        new ErrorHandler("Room number already exists in this hostel", 400)
      );
    }

    const room = await HostelRoom.create(req.body);

    // Update hostel total rooms
    hostel.totalRooms += 1;
    await hostel.save();

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  }
);

// Get Rooms by Hostel
export const getRoomsByHostel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hostelId } = req.params;
    const { isAvailable, roomType } = req.query;

    const query: any = { hostelId };
    if (isAvailable !== undefined) query.isAvailable = isAvailable === "true";
    if (roomType) query.roomType = roomType;

    const rooms = await HostelRoom.find(query).populate("hostelId");

    res.status(200).json({
      success: true,
      rooms,
    });
  }
);

// Update Room
export const updateRoom = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const room = await HostelRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  }
);

// Assign Student to Hostel Room
export const assignStudentToRoom = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, hostelId, roomId, monthlyFee, startDate } = req.body;

    const student = await Student.findById(studentId);
    const hostel = await Hostel.findById(hostelId);
    const room = await HostelRoom.findById(roomId);

    if (!student || !hostel || !room) {
      return next(new ErrorHandler("Student, hostel, or room not found", 404));
    }

    // Check if student already has active hostel assignment
    const existingAssignment = await HostelAssignment.findOne({
      studentId,
      isActive: true,
    });

    if (existingAssignment) {
      return next(
        new ErrorHandler("Student already assigned to a hostel room", 400)
      );
    }

    // Check room availability
    if (room.currentOccupancy >= room.capacity) {
      return next(new ErrorHandler("Room is at full capacity", 400));
    }

    const assignment = await HostelAssignment.create({
      studentId,
      hostelId,
      roomId,
      monthlyFee,
      startDate,
      isActive: true,
    });

    // Update room occupancy
    room.currentOccupancy += 1;
    room.isAvailable = room.currentOccupancy < room.capacity;
    await room.save();

    // Update hostel occupied rooms count
    hostel.occupiedRooms += 1;
    await hostel.save();

    // Notify student
    await Notification.create({
      userId: student.userId,
      title: "Hostel Assigned",
      message: `You have been assigned to ${hostel.name} - Room ${room.roomNumber}`,
      type: "info",
    });

    res.status(201).json({
      success: true,
      message: "Student assigned to hostel room successfully",
      assignment,
    });
  }
);

// Unassign Student from Hostel
export const unassignStudentFromRoom = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { assignmentId } = req.params;

    const assignment = await HostelAssignment.findById(assignmentId);

    if (!assignment) {
      return next(new ErrorHandler("Assignment not found", 404));
    }

    assignment.isActive = false;
    assignment.endDate = new Date();
    await assignment.save();

    // Update room occupancy
    const room = await HostelRoom.findById(assignment.roomId);
    if (room) {
      room.currentOccupancy -= 1;
      room.isAvailable = true;
      await room.save();
    }

    // Update hostel occupied rooms
    const hostel = await Hostel.findById(assignment.hostelId);
    if (hostel && hostel.occupiedRooms > 0) {
      hostel.occupiedRooms -= 1;
      await hostel.save();
    }

    res.status(200).json({
      success: true,
      message: "Student unassigned from hostel successfully",
      assignment,
    });
  }
);

// Get Hostel Assignments
export const getHostelAssignments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hostelId, studentId, isActive } = req.query;

    const query: any = {};
    if (hostelId) query.hostelId = hostelId;
    if (studentId) query.studentId = studentId;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const assignments = await HostelAssignment.find(query)
      .populate("studentId hostelId roomId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assignments,
    });
  }
);
