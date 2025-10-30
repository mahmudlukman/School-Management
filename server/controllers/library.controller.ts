import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";
import { Book } from "../models/Library";
import { BookIssue } from "../models/BookIssue";
import { Student } from "../models/Student";
import { Types } from "mongoose";

export const addBook = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if ISBN exists
    const existingBook = await Book.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return next(new ErrorHandler("Book with this ISBN already exists", 400));
    }

    const book = await Book.create({
      ...req.body,
      availableQuantity: req.body.quantity,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  }
);

// Get Books
export const getBooks = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, category, search } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ title: 1 });

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Issue Book
export const issueBook = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, studentId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    if (book.availableQuantity <= 0) {
      return next(new ErrorHandler("Book not available", 400));
    }

    // Check if student already has this book
    const existingIssue = await BookIssue.findOne({
      bookId,
      studentId,
      status: "issued",
    });

    if (existingIssue) {
      return next(new ErrorHandler("Student already has this book", 400));
    }

    const issue = await BookIssue.create({
      bookId,
      studentId,
      issueDate: new Date(),
      dueDate,
      issuedBy: req.user?._id,
    });

    // Update book availability
    book.availableQuantity -= 1;
    await book.save();

    // Notify student
    const student = await Student.findById(studentId);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: "Book Issued",
        message: `${book.title} has been issued to you`,
        type: "info",
      });
    }

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      issue,
    });
  }
);

// Return Book
export const returnBook = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { issueId } = req.params;
    const { fine } = req.body;

    const issue = await BookIssue.findById(issueId).populate("bookId");
    if (!issue) {
      return next(new ErrorHandler("Issue record not found", 404));
    }

    issue.returnDate = new Date();
    issue.status = "returned";
    issue.fine = fine || 0;
    issue.returnedTo = req.user?._id as Types.ObjectId;
    await issue.save();

    // Update book availability
    const book = issue.bookId as any;
    book.availableQuantity += 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      issue,
    });
  }
);

// Get Book Issues
export const getBookIssues = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, status, bookId } = req.query;

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    if (bookId) query.bookId = bookId;

    const issues = await BookIssue.find(query)
      .populate("bookId studentId issuedBy returnedTo")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      issues,
    });
  }
);
