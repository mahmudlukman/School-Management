import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  getAttendance,
  getStudentAttendanceReport,
  markAttendance,
  updateAttendance,
} from "../controllers/attendance.controller";

const attendanceRouter = express.Router();

attendanceRouter.post(
  "/mark-attendance",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.TEACHER),
  markAttendance
);
attendanceRouter.get(
  "/attendance",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT
  ),
  getAttendance
);
attendanceRouter.get(
  "/attendance-report/:studentId",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT
  ),
  getStudentAttendanceReport
);
attendanceRouter.delete(
  "/update-attendance/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.TEACHER),
  updateAttendance
);

export default attendanceRouter;
