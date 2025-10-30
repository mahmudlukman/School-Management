import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  assignComplaint,
  deleteComplaint,
  getAllComplaints,
  getComplaint,
  getMyComplaints,
  submitComplaint,
  updateComplaintStatus,
} from "../controllers/complaint.controller";

const complaintRouter = express.Router();

complaintRouter.post("/submit-complaint", isAuthenticated, submitComplaint);

complaintRouter.get(
  "/complaints",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  getAllComplaints
);

complaintRouter.get("/my-complaints", isAuthenticated, getMyComplaints);

complaintRouter.get("/complaint/:id", isAuthenticated, getComplaint);

complaintRouter.post(
  "/assign-complaint",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  assignComplaint
);

complaintRouter.put(
  "/update-complaints-status/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateComplaintStatus
);

complaintRouter.delete(
  "/delete-complaint/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteComplaint
);

export default complaintRouter;
