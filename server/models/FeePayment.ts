import mongoose, { Schema, Document, Types } from "mongoose";
import { FeeStatus } from "../@types/types";

export interface IFeePayment extends Document {
  studentId: Types.ObjectId;
  feeStructureId: Types.ObjectId;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: "cash" | "card" | "bank_transfer" | "cheque" | "online";
  transactionId?: string;
  status: FeeStatus;
  discount?: number;
  remarks?: string;
  receivedBy: Types.ObjectId;
}

const FeePaymentSchema = new Schema<IFeePayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    feeStructureId: {
      type: Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "cheque", "online"],
      required: true,
    },
    transactionId: String,
    status: { type: String, enum: Object.values(FeeStatus), required: true },
    discount: { type: Number, default: 0 },
    remarks: String,
    receivedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

FeePaymentSchema.index({ studentId: 1, paymentDate: -1 });
FeePaymentSchema.index({ status: 1 });

export const FeePayment = mongoose.model<IFeePayment>(
  "FeePayment",
  FeePaymentSchema
);
