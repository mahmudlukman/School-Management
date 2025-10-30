import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  assignStudent,
  createTransport,
  deleteTransport,
  getAllTransports,
  getTransport,
  getTransportAssignments,
  unassignStudent,
  updateTransport,
} from "../controllers/transport.controller";
const transportRouter = express.Router();

transportRouter.post(
  "/create-transport",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createTransport
);

transportRouter.get("/transports", isAuthenticated, getAllTransports);

transportRouter.get("/transport/:id", isAuthenticated, getTransport);

transportRouter.put(
  "/update-transport/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateTransport
);

transportRouter.delete(
  "/delete-transport/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteTransport
);

transportRouter.post(
  "/assign-transport",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  assignStudent
);

transportRouter.put(
  "/unassign-transport/:assignmentId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  unassignStudent
);

transportRouter.get(
  "/transport-assignments",
  isAuthenticated,
  getTransportAssignments
);

export default transportRouter;
