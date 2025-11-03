import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import { deleteOldActivityLogs, exportActivityLogs, getActivityLog, getActivityLogsByModule, getActivityStatistics, getAllActivityLogs, getUserActivityLogs } from "../controllers/activityLog.controller";

const activityLogRouter = express.Router();

activityLogRouter.get(
  "/activity-logs",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getAllActivityLogs
);

activityLogRouter.get(
  "/activity-logs-statistics",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getActivityStatistics
);

activityLogRouter.get(
  "/user-activity-logs/:userId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getUserActivityLogs
);

activityLogRouter.get(
  "/activity-logs-by-module/:module",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getActivityLogsByModule
);

activityLogRouter.get(
  "/export-activity-logs",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  exportActivityLogs
);

activityLogRouter.get(
  "/activity-log/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getActivityLog
);

activityLogRouter.delete(
  "/cleanup-activity-logs",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN),
  deleteOldActivityLogs
);

export default activityLogRouter;
