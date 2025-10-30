import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacher,
} from "../controllers/teacher.controller";

const teacherRouter = express.Router();

teacherRouter.post(
  "/create-teacher",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createTeacher
);
teacherRouter.get("/teachers", isAuthenticated, getAllTeachers);
teacherRouter.get(
  "/teacher/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getTeacher
);
teacherRouter.delete(
  "/delete-teacher/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteTeacher
);

export default teacherRouter;
