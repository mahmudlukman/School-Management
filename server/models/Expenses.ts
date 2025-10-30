import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExpense extends Document {
  category:
    | "salary"
    | "maintenance"
    | "utilities"
    | "supplies"
    | "transport"
    | "other";
  description: string;
  amount: number;
  date: Date;
  paymentMethod: "cash" | "card" | "bank_transfer" | "cheque";
  receipt?: string;
  approvedBy: Types.ObjectId;
  remarks?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    category: {
      type: String,
      enum: [
        "salary",
        "maintenance",
        "utilities",
        "supplies",
        "transport",
        "other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "cheque"],
      required: true,
    },
    receipt: String,
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    remarks: String,
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
