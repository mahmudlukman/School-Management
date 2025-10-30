import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  assignStudentToRoom,
  createHostel,
  createRoom,
  deleteHostel,
  getAllHostels,
  getHostel,
  getHostelAssignments,
  getRoomsByHostel,
  unassignStudentFromRoom,
  updateHostel,
  updateRoom,
} from "../controllers/Hostel.controller";

const hostelRouter = express.Router();

hostelRouter.post(
  "/create-hostel",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createHostel
);

hostelRouter.get("/hostels", isAuthenticated, getAllHostels);

hostelRouter.get("/hostel/:id", isAuthenticated, getHostel);

hostelRouter.put(
  "/update-hostel/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateHostel
);

hostelRouter.delete(
  "/delete-hostel/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteHostel
);

hostelRouter.post(
  "/create-room",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createRoom
);

hostelRouter.get("/hostel-rooms/:hostelId", isAuthenticated, getRoomsByHostel);

hostelRouter.put(
  "/update-room/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateRoom
);

hostelRouter.post(
  "/assign-room",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  assignStudentToRoom
);

hostelRouter.put(
  "/unassign-room/:assignmentId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  unassignStudentFromRoom
);

hostelRouter.get("/hostels-assignments", isAuthenticated, getHostelAssignments);

export default hostelRouter;
