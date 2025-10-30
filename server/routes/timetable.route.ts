import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  getTeacherTimetable,
  getTimetable,
  upsertTimetable,
} from "../controllers/timetable.controller";

const timetableRouter = express.Router();

timetableRouter.post(
  "/upsert-timetable",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  upsertTimetable
);
timetableRouter.get("/timetable", isAuthenticated, getTimetable);
timetableRouter.get(
  "/teacher-timetable",
  isAuthenticated,
  authorizeRoles(UserRole.TEACHER),
  getTeacherTimetable
);

export default timetableRouter;
