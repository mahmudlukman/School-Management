import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createParent,
  deleteParent,
  getAllParents,
  getChildAttendance,
  getChildFeeSummary,
  getChildrenInfo,
  getChildResults,
  getParent,
  linkToStudent,
  unlinkFromStudent,
  updateParent,
} from "../controllers/parent.controller";

const parentRouter = express.Router();

// Create Parent
parentRouter.post(
  "/create-parent",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createParent
);

// Get All Parents
parentRouter.get(
  "/parents",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER),
  getAllParents
);

// Get Single Parent
parentRouter.get(
  "/parent/:id",
  isAuthenticated,
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.TEACHER,
    UserRole.PARENT
  ),
  getParent
);

// Update Parent
parentRouter.put(
  "/update-parent/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateParent
);

// Delete Parent
parentRouter.delete(
  "/delete-parent/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteParent
);

// Link Parent to Student
parentRouter.post(
  "/link-student",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  linkToStudent
);

// Unlink Parent from Student
parentRouter.post(
  "/unlink-student",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  unlinkFromStudent
);

// Get Parent's Children Info
parentRouter.get(
  "/children-info",
  isAuthenticated,
  authorizeRoles(UserRole.PARENT),
  getChildrenInfo
);

// Get Child's Attendance (for parent)
parentRouter.get(
  "/child-attendance/:studentId",
  isAuthenticated,
  authorizeRoles(UserRole.PARENT),
  getChildAttendance
);

// Get Child's Results (for parent)
parentRouter.get(
  "/child-results/:studentId",
  isAuthenticated,
  authorizeRoles(UserRole.PARENT),
  getChildResults
);

// Get Child's Fee Summary (for parent)
parentRouter.get(
  "/child-fees-summary/:studentId",
  isAuthenticated,
  authorizeRoles(UserRole.PARENT),
  getChildFeeSummary
);

export default parentRouter;
