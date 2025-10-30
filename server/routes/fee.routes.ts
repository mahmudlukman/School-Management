import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createFeeStructure,
  getFeePayments,
  getFeeStructures,
  getStudentFeeSummary,
  recordPayment,
} from "../controllers/fee.controller";

const feeRouter = express.Router();

feeRouter.post(
  "/create-fees-structure",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  createFeeStructure
);
feeRouter.get("/fees-structures", isAuthenticated, getFeeStructures);
feeRouter.post(
  "/record-fees-payment",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.ACCOUNTANT),
  recordPayment
);

feeRouter.get(
  "/fees-payment",
  isAuthenticated,
  authorizeRoles(
    UserRole.ACCOUNTANT,
    UserRole.ADMIN,
    UserRole.STUDENT,
    UserRole.PARENT
  ),
  getFeePayments
);

feeRouter.get(
  "/fees-summary/:studentId",
  isAuthenticated,
  authorizeRoles(
    UserRole.ACCOUNTANT,
    UserRole.ADMIN,
    UserRole.STUDENT,
    UserRole.PARENT
  ),
  getStudentFeeSummary
);

export default feeRouter;
