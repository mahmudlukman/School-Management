import { Request, Response, NextFunction } from "express";
import { Expense } from "../models/Expenses";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { ActivityLog } from "../models/ActivityLog";
import ErrorHandler from "../utils/errorHandler";

export const createExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await Expense.create({
      ...req.body,
      approvedBy: req.user?._id,
    });

    await ActivityLog.create({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: "CREATE",
      module: "EXPENSE",
      description: `Recorded expense: ${expense.category} - ${expense.amount}`,
    });

    res.status(201).json({
      success: true,
      message: "Expense recorded successfully",
      expense,
    });
  }
);

// Get All Expenses
export const getAllExpenses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      paymentMethod,
    } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const expenses = await Expense.find(query)
      .populate("approvedBy")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ date: -1 });

    const total = await Expense.countDocuments(query);

    // Calculate total amount
    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      expenses,
      totalAmount: totalAmount[0]?.total || 0,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

// Get Single Expense
export const getExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await Expense.findById(req.params.id).populate(
      "approvedBy"
    );

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    res.status(200).json({
      success: true,
      expense,
    });
  }
);

// Update Expense
export const updateExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  }
);

// Delete Expense
export const deleteExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  }
);

// Get Expense Summary
export const getExpenseSummary = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    const query: any = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    // Total by category
    const byCategory = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Total by payment method
    const byPaymentMethod = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Grand total
    const grandTotal = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      summary: {
        grandTotal: grandTotal[0]?.total || 0,
        byCategory,
        byPaymentMethod,
      },
    });
  }
);
