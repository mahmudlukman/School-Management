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
  "/create-fee-structure",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  createFeeStructure
);
feeRouter.get("/fee-structure", isAuthenticated, getFeeStructures);
feeRouter.post(
  "/record-fee-payment",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.ACCOUNTANT),
  recordPayment
);

feeRouter.get(
  "/fee-payment",
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
  "/fee-summary/:studentId",
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
