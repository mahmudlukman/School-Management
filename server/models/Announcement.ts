import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../@types/types";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: UserRole[];
  expiryDate?: Date;
  isActive: boolean;
  createdBy: Types.ObjectId;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    targetAudience: [{ type: String, enum: Object.values(UserRole) }],
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);
