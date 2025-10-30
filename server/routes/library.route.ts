import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  addBook,
  getBookIssues,
  getBooks,
  issueBook,
  returnBook,
} from "../controllers/library.controller";

const libraryRouter = express.Router();

libraryRouter.post(
  "/add-book",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.LIBRARIAN),
  addBook
);
libraryRouter.get("/books", isAuthenticated, getBooks);
libraryRouter.post(
  "/issue-book",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.LIBRARIAN),
  issueBook
);
libraryRouter.put(
  "/return-book/:issueId",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.LIBRARIAN),
  returnBook
);
libraryRouter.get("/books-issued", isAuthenticated, getBookIssues);

export default libraryRouter;
