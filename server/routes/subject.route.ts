import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  assignTeacher,
  createSubject,
  getSubjects,
} from "../controllers/subject.controller";

const subjectRouter = express.Router();

subjectRouter.post(
  "/create-subject",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createSubject
);
subjectRouter.get("/subjects", isAuthenticated, getSubjects);
subjectRouter.put(
  "/assign-teacher/:subjectId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  assignTeacher
);

export default subjectRouter;
