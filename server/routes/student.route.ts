import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import {
  bulkPromoteStudents,
  bulkUpdateStudents,
  bulkUploadStudents,
  createStudent,
  deleteStudent,
  getAllStudents,
  getPromotionPreview,
  getStudent,
  graduateStudents,
  promoteStudent,
  transferStudent,
  updateStudent,
} from "../controllers/student.controller";
import { UserRole } from "../@types/types";

const studentRouter = express.Router();

studentRouter.post(
  "/create-student",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createStudent
);
studentRouter.get(
  "/students",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.ACCOUNTANT
  ),
  getAllStudents
);
studentRouter.get(
  "/student/:id",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT
  ),
  getStudent
);
studentRouter.put(
  "/update-student/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateStudent
);
studentRouter.delete(
  "/delete-student/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteStudent
);

// Bulk Upload Students
studentRouter.post(
  "/bulk-upload-students",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  bulkUploadStudents
);

// Promote Single Student
studentRouter.put(
  "/promote-student/:studentId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  promoteStudent
);

// Bulk Promote Students
studentRouter.post(
  "/bulk-promote-students",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  bulkPromoteStudents
);

// Graduate Students
studentRouter.post(
  "/graduate-students",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  graduateStudents
);

// Transfer Student
studentRouter.put(
  "/transfer-student/:studentId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  transferStudent
);

// Bulk Update Students
studentRouter.put(
  "/bulk-update-students",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  bulkUpdateStudents
);

// Get Promotion Preview
studentRouter.get(
  "/promotion-preview",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getPromotionPreview
);

export default studentRouter;
