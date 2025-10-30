import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { Student } from "../models/Student";
import ErrorHandler from "../utils/errorHandler";
import { User } from "../models/User";
import { UserRole } from "../@types/types";
import { Types } from "mongoose";
import { Section } from "../models/Section";
import { ActivityLog } from "../models/ActivityLog";
import { Class } from "../models/Class";
import { Notification } from "../models/Notification";

export const createStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const studentData = req.body;

    // Check if admission number exists
    const existingStudent = await Student.findOne({
      admissionNumber: studentData.admissionNumber,
    });
    if (existingStudent) {
      return next(new ErrorHandler("Admission number already exists", 400));
    }

    const user = await User.create({
      email: studentData.email,
      password: studentData.password,
      role: UserRole.STUDENT,
    });

    // Create student profile
    const student = await Student.create({
      ...studentData,
      userId: user._id,
    });

    user.profileId = student._id as Types.ObjectId;
    await user.save();

    // Update section strength
    await Section.findByIdAndUpdate(studentData.sectionId, {
      $inc: { currentStrength: 1 },
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "STUDENT",
      description: `Created student: ${student.firstName} ${student.lastName}`,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  }
);

// Get All Students
export const getAllStudents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      classId,
      sectionId,
      status,
      search,
    } = req.query;

    const query: any = {};
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { admissionNumber: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(query)
      .populate("classId sectionId parentIds")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      students,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Single Student
export const getStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id).populate(
      "classId sectionId parentIds userId"
    );

    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    res.status(200).json({
      success: true,
      student,
    });
  }
);

// Update Student
export const updateStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    const oldSectionId = student.sectionId;
    const newSectionId = req.body.sectionId;

    // Update section strength if section changed
    if (oldSectionId.toString() !== newSectionId?.toString()) {
      await Section.findByIdAndUpdate(oldSectionId, {
        $inc: { currentStrength: -1 },
      });
      await Section.findByIdAndUpdate(newSectionId, {
        $inc: { currentStrength: 1 },
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "UPDATE",
      module: "STUDENT",
      description: `Updated student: ${updatedStudent?.firstName} ${updatedStudent?.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  }
);

// Delete Student
export const deleteStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    // Update section strength
    await Section.findByIdAndUpdate(student.sectionId, {
      $inc: { currentStrength: -1 },
    });

    // Delete user account
    await User.findByIdAndDelete(student.userId);

    // Delete student
    await student.deleteOne();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "DELETE",
      module: "STUDENT",
      description: `Deleted student: ${student.firstName} ${student.lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  }
);

// ==================== STUDENT PROMOTION & BULK OPERATIONS ====================

export const bulkUploadStudents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { students } = req.body; // Array of student objects

    if (!Array.isArray(students) || students.length === 0) {
      return next(new ErrorHandler("Please provide an array of students", 400));
    }

    const results = {
      successful: [] as any[],
      failed: [] as any[],
    };

    for (const studentData of students) {
      try {
        // Check if admission number exists
        const existingStudent = await Student.findOne({
          admissionNumber: studentData.admissionNumber,
        });

        if (existingStudent) {
          results.failed.push({
            admissionNumber: studentData.admissionNumber,
            reason: "Admission number already exists",
          });
          continue;
        }

        // Check if email exists
        const existingUser = await User.findOne({
          email: studentData.email,
        });

        if (existingUser) {
          results.failed.push({
            admissionNumber: studentData.admissionNumber,
            email: studentData.email,
            reason: "Email already exists",
          });
          continue;
        }

        // Verify class and section exist
        const classExists = await Class.findById(studentData.classId);
        const sectionExists = await Section.findById(studentData.sectionId);

        if (!classExists || !sectionExists) {
          results.failed.push({
            admissionNumber: studentData.admissionNumber,
            reason: "Invalid class or section ID",
          });
          continue;
        }

        // Check section capacity
        if (sectionExists.currentStrength >= sectionExists.capacity) {
          results.failed.push({
            admissionNumber: studentData.admissionNumber,
            reason: "Section is full",
          });
          continue;
        }

        const user = await User.create({
          email: studentData.email,
          password: studentData.password,
          role: "student",
        });

        // Create student profile
        const student = await Student.create({
          ...studentData,
          userId: user._id,
          status: "active",
        });

        // Update user with profile ID
        user.profileId = student._id as Types.ObjectId;
        await user.save();

        // Update section strength
        await Section.findByIdAndUpdate(studentData.sectionId, {
          $inc: { currentStrength: 1 },
        });

        results.successful.push({
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student._id,
        });
      } catch (error: any) {
        results.failed.push({
          admissionNumber: studentData.admissionNumber,
          reason: error.message,
        });
      }
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "BULK_UPLOAD",
      module: "STUDENT",
      description: `Bulk uploaded ${results.successful.length} students. ${results.failed.length} failed.`,
    });

    res.status(201).json({
      success: true,
      message: `Uploaded ${results.successful.length} students successfully`,
      results,
    });
  }
);

// Promote Single Student
export const promoteStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    const { newClassId, newSectionId, newRollNumber } = req.body;

    const student = await Student.findById(studentId).populate(
      "classId sectionId"
    );
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    // Verify new class and section exist
    const newClass = await Class.findById(newClassId);
    const newSection = await Section.findById(newSectionId);

    if (!newClass || !newSection) {
      return next(new ErrorHandler("Invalid class or section", 400));
    }

    // Check if new section has capacity
    if (newSection.currentStrength >= newSection.capacity) {
      return next(new ErrorHandler("New section is full", 400));
    }

    const oldClassId = student.classId;
    const oldSectionId = student.sectionId;

    // Update student
    student.classId = newClassId;
    student.sectionId = newSectionId;
    student.rollNumber = newRollNumber;
    await student.save();

    // Update section strengths
    await Section.findByIdAndUpdate(oldSectionId, {
      $inc: { currentStrength: -1 },
    });
    await Section.findByIdAndUpdate(newSectionId, {
      $inc: { currentStrength: 1 },
    });

    // Notify student
    await Notification.create({
      userId: student.userId,
      title: "Class Promotion",
      message: `Congratulations! You have been promoted to ${newClass.name}`,
      type: "success",
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "PROMOTE",
      module: "STUDENT",
      description: `Promoted student ${student.firstName} ${student.lastName} to ${newClass.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Student promoted successfully",
      student,
    });
  }
);

// Bulk Promote Students (by class/section)
export const bulkPromoteStudents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      fromClassId,
      fromSectionId,
      toClassId,
      toSectionId,
      academicYearId,
      studentIds, // Optional: specific students to promote
    } = req.body;

    // Verify classes and sections exist
    const fromClass = await Class.findById(fromClassId);
    const toClass = await Class.findById(toClassId);
    const toSection = await Section.findById(toSectionId);

    if (!fromClass || !toClass || !toSection) {
      return next(new ErrorHandler("Invalid class or section", 400));
    }

    // Get students to promote
    const query: any = {
      classId: fromClassId,
      status: "active",
    };

    if (fromSectionId) {
      query.sectionId = fromSectionId;
    }

    if (studentIds && studentIds.length > 0) {
      query._id = { $in: studentIds };
    }

    const students = await Student.find(query);

    if (students.length === 0) {
      return next(new ErrorHandler("No students found to promote", 404));
    }

    // Check if target section has enough capacity
    const availableCapacity = toSection.capacity - toSection.currentStrength;
    if (availableCapacity < students.length) {
      return next(
        new ErrorHandler(
          `Not enough capacity in target section. Available: ${availableCapacity}, Required: ${students.length}`,
          400
        )
      );
    }

    const results = {
      successful: [] as any[],
      failed: [] as any[],
    };

    let rollNumber = toSection.currentStrength + 1;

    for (const student of students) {
      try {
        const oldSectionId = student.sectionId;

        // Update student
        student.classId = toClassId;
        student.sectionId = toSectionId;
        student.rollNumber = rollNumber++;
        await student.save();

        // Update old section strength
        await Section.findByIdAndUpdate(oldSectionId, {
          $inc: { currentStrength: -1 },
        });

        // Notify student
        await Notification.create({
          userId: student.userId,
          title: "Class Promotion",
          message: `Congratulations! You have been promoted to ${toClass.name}`,
          type: "success",
        });

        results.successful.push({
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          newClass: toClass.name,
          newSection: toSection.name,
        });
      } catch (error: any) {
        results.failed.push({
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          reason: error.message,
        });
      }
    }

    // Update new section strength
    await Section.findByIdAndUpdate(toSectionId, {
      $inc: { currentStrength: results.successful.length },
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "BULK_PROMOTE",
      module: "STUDENT",
      description: `Promoted ${results.successful.length} students from ${fromClass.name} to ${toClass.name}`,
    });

    res.status(200).json({
      success: true,
      message: `Promoted ${results.successful.length} students successfully`,
      results,
    });
  }
);

// Graduate Students
export const graduateStudents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentIds, classId, sectionId } = req.body;

    const query: any = { status: "active" };

    if (studentIds && studentIds.length > 0) {
      query._id = { $in: studentIds };
    } else if (classId) {
      query.classId = classId;
      if (sectionId) {
        query.sectionId = sectionId;
      }
    } else {
      return next(
        new ErrorHandler("Please provide studentIds or classId", 400)
      );
    }

    const students = await Student.find(query);

    if (students.length === 0) {
      return next(new ErrorHandler("No students found to graduate", 404));
    }

    const graduated = [];

    for (const student of students) {
      student.status = "graduated";
      await student.save();

      // Update section strength
      await Section.findByIdAndUpdate(student.sectionId, {
        $inc: { currentStrength: -1 },
      });

      // Notify student
      await Notification.create({
        userId: student.userId,
        title: "Congratulations!",
        message: "You have successfully graduated!",
        type: "success",
      });

      graduated.push({
        admissionNumber: student.admissionNumber,
        name: `${student.firstName} ${student.lastName}`,
      });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "GRADUATE",
      module: "STUDENT",
      description: `Graduated ${graduated.length} students`,
    });

    res.status(200).json({
      success: true,
      message: `${graduated.length} students graduated successfully`,
      graduated,
    });
  }
);

// Transfer Student to Another School
export const transferStudent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    const { transferSchool, transferDate, reason } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }

    if (student.status === "transferred") {
      return next(new ErrorHandler("Student already transferred", 400));
    }

    // Update student status
    student.status = "transferred";
    await student.save();

    // Update section strength
    await Section.findByIdAndUpdate(student.sectionId, {
      $inc: { currentStrength: -1 },
    });

    // Deactivate user account
    await User.findByIdAndUpdate(student.userId, { isActive: false });

    // Notify student/parents
    await Notification.create({
      userId: student.userId,
      title: "Transfer Notification",
      message: `Your transfer to ${transferSchool} has been processed`,
      type: "info",
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "TRANSFER",
      module: "STUDENT",
      description: `Transferred student ${student.firstName} ${student.lastName} to ${transferSchool}`,
      metadata: {
        transferSchool,
        transferDate,
        reason,
      },
    });

    res.status(200).json({
      success: true,
      message: "Student transferred successfully",
      student,
    });
  }
);

// Bulk Update Students
export const bulkUpdateStudents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentIds, updates } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return next(new ErrorHandler("Please provide student IDs", 400));
    }

    if (!updates || Object.keys(updates).length === 0) {
      return next(new ErrorHandler("Please provide updates", 400));
    }

    // Prevent updating critical fields
    const restrictedFields = ["admissionNumber", "userId", "_id", "createdAt"];
    for (const field of restrictedFields) {
      if (updates.hasOwnProperty(field)) {
        return next(new ErrorHandler(`Cannot update field: ${field}`, 400));
      }
    }

    const result = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: updates }
    );

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "BULK_UPDATE",
      module: "STUDENT",
      description: `Updated ${result.modifiedCount} students`,
      metadata: { updates },
    });

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} students updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  }
);

// Get Promotion Preview
export const getPromotionPreview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fromClassId, fromSectionId, toClassId, toSectionId } = req.query;

    // Get students to be promoted
    const query: any = {
      classId: fromClassId,
      status: "active",
    };

    if (fromSectionId) {
      query.sectionId = fromSectionId;
    }

    const students = await Student.find(query)
      .select("firstName lastName admissionNumber rollNumber")
      .populate("classId sectionId", "name");

    // Get target section info
    const toSection = await Section.findById(toSectionId).populate(
      "classId",
      "name"
    );

    if (!toSection) {
      return next(new ErrorHandler("Target section not found", 404));
    }

    const availableCapacity = toSection.capacity - toSection.currentStrength;
    const canPromoteAll = students.length <= availableCapacity;

    res.status(200).json({
      success: true,
      preview: {
        totalStudents: students.length,
        targetSection: {
          name: toSection.name,
          className: (toSection.classId as any).name,
          capacity: toSection.capacity,
          currentStrength: toSection.currentStrength,
          availableCapacity,
        },
        canPromoteAll,
        students,
      },
    });
  }
);
