import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISalary extends Document {
  teacherId: Types.ObjectId;
  month: number; // 1-12
  year: number;
  basicSalary: number;
  allowances: {
    type: string;
    amount: number;
  }[];
  deductions: {
    type: string;
    amount: number;
  }[];
  netSalary: number;
  paymentDate?: Date;
  paymentMethod?: "cash" | "bank_transfer" | "cheque";
  status: "pending" | "paid" | "cancelled";
  remarks?: string;
}

const SalarySchema = new Schema<ISalary>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: [
      {
        type: String,
        amount: Number,
      },
    ],
    deductions: [
      {
        type: String,
        amount: Number,
      },
    ],
    netSalary: { type: Number, required: true },
    paymentDate: Date,
    paymentMethod: { type: String, enum: ["cash", "bank_transfer", "cheque"] },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    remarks: String,
  },
  { timestamps: true }
);

export const Salary = mongoose.model<ISalary>("Salary", SalarySchema);
