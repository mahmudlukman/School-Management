import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpense,
  getExpenseSummary,
  updateExpense,
} from "../controllers/expense.controller";

const expenseRouter = express.Router();

expenseRouter.post(
  "/create-expense",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  createExpense
);

expenseRouter.get(
  "/expenses",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  getAllExpenses
);

expenseRouter.get(
  "/expenses-summary",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  getExpenseSummary
);

expenseRouter.get(
  "/expense/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  getExpense
);

expenseRouter.put(
  "/update-expense/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACCOUNTANT),
  updateExpense
);

expenseRouter.delete(
  "/delete-expense/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteExpense
);

export default expenseRouter;
