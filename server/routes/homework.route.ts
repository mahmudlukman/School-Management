import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createHomework,
  getHomework,
  gradeHomework,
  submitHomework,
} from "../controllers/homework.controller";

const homeworkRouter = express.Router();

homeworkRouter.post(
  "/create-homework",
  isAuthenticated,
  authorizeRoles(UserRole.TEACHER),
  createHomework
);
homeworkRouter.get("/homework", isAuthenticated, getHomework);
homeworkRouter.post(
  "/submit-homework",
  isAuthenticated,
  authorizeRoles(UserRole.STUDENT),
  submitHomework
);

homeworkRouter.put(
  "/grade-homework/:submissionId",
  isAuthenticated,
  authorizeRoles(UserRole.TEACHER),
  gradeHomework
);

export default homeworkRouter;
