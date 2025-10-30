import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAcademicYear,
  getAllAcademicYears,
  getCurrentAcademicYear,
  setCurrentAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear.controller";

const academicYearRouter = express.Router();

// Create Academic Year
academicYearRouter.post(
  "/create-academic-year",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createAcademicYear
);

// Get All Academic Years
academicYearRouter.get("/academic-years", isAuthenticated, getAllAcademicYears);

// Get Current Academic Year
academicYearRouter.get(
  "/current-academic-year",
  isAuthenticated,
  getCurrentAcademicYear
);

// Get Single Academic Year
academicYearRouter.get("/academic-year/:id", isAuthenticated, getAcademicYear);

// Update Academic Year
academicYearRouter.put(
  "/update-academic-year/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateAcademicYear
);

// Set as Current Academic Year
academicYearRouter.put(
  "/set-current-academic-year/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  setCurrentAcademicYear
);

// Delete Academic Year
academicYearRouter.delete(
  "/delete-academic-year/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteAcademicYear
);

export default academicYearRouter;
