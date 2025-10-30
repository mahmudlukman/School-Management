import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  assignClassTeacher,
  createClass,
  createSection,
  getAllClasses,
  getSectionsByClass,
} from "../controllers/class.controller";

const classRouter = express.Router();

classRouter.post(
  "/create-class",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createClass
);
classRouter.get("/classes", isAuthenticated, getAllClasses);
classRouter.post(
  "/create-sections",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createSection
);
classRouter.get("/class-section/:classId", isAuthenticated, getSectionsByClass);
classRouter.put(
  "/assign-class-teacher/:classId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  assignClassTeacher
);

export default classRouter;
