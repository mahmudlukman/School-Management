import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} from "../controllers/leave.controller";

const timetableRouter = express.Router();

timetableRouter.post("/apply-for-leave", isAuthenticated, applyLeave);
timetableRouter.get(
  "/leaves",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.STUDENT
  ),
  getLeaves
);
timetableRouter.put(
  "/update-leave-status/:leaveId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateLeaveStatus
);

export default timetableRouter;
