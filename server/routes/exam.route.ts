import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  addResult,
  createExam,
  createExamSchedule,
  getAllExams,
  getExamSchedule,
  getResults,
} from "../controllers/exam.controller";

const examRouter = express.Router();

examRouter.post(
  "/create-exams",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createExam
);
examRouter.get("/exams", isAuthenticated, getAllExams);
examRouter.post(
  "/create-exams-schedule",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createExamSchedule
);

examRouter.get("/exams-schedule/:examId", isAuthenticated, getExamSchedule);
examRouter.post(
  "/add-result",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.TEACHER),
  addResult
);
examRouter.get("/results", isAuthenticated, getResults);

export default examRouter;
