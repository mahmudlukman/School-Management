import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../@types/types";

export interface IComplaint extends Document {
  submittedBy: Types.ObjectId;
  submitterRole: UserRole;
  category:
    | "academic"
    | "discipline"
    | "facility"
    | "transport"
    | "hostel"
    | "other";
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: Types.ObjectId;
  resolution?: string;
  resolvedDate?: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submitterRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    category: {
      type: String,
      enum: [
        "academic",
        "discipline",
        "facility",
        "transport",
        "hostel",
        "other",
      ],
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    resolution: String,
    resolvedDate: Date,
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>(
  "Complaint",
  ComplaintSchema
);
