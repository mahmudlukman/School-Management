import mongoose, { Schema, Document, Types } from "mongoose";

import { UserRole } from "../@types/types";
export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  userRole: UserRole;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userRole: { type: String, enum: Object.values(UserRole), required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    description: { type: String, required: true },
    ipAddress: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ module: 1, action: 1 });

export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);
