import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  getAdminDashboard,
  getStudentDashboard,
  getTeacherDashboard,
} from "../controllers/dashboard.controller";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/admin-dashboard",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getAdminDashboard
);
dashboardRouter.get(
  "/teacher-dashboard",
  isAuthenticated,
  authorizeRoles(UserRole.TEACHER),
  getTeacherDashboard
);
dashboardRouter.get(
  "/student-dashboard",
  isAuthenticated,
  authorizeRoles(UserRole.STUDENT),
  getStudentDashboard
);

export default dashboardRouter;
