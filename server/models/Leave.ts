import mongoose, { Schema, Document, Types } from "mongoose";
import { LeaveStatus, UserRole } from "../@types/types";

export interface ILeave extends Document {
  userId: Types.ObjectId;
  userRole: UserRole;
  leaveType: "sick" | "casual" | "emergency" | "other";
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  appliedDate: Date;
  approvedBy?: Types.ObjectId;
  approvedDate?: Date;
  remarks?: string;
}

const LeaveSchema = new Schema<ILeave>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userRole: { type: String, enum: Object.values(UserRole), required: true },
    leaveType: {
      type: String,
      enum: ["sick", "casual", "emergency", "other"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    appliedDate: { type: Date, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedDate: Date,
    remarks: String,
  },
  { timestamps: true }
);

export const Leave = mongoose.model<ILeave>("Leave", LeaveSchema);
