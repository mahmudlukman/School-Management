import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../@types/types";

export interface IEvent extends Document {
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  eventType:
    | "academic"
    | "sports"
    | "cultural"
    | "holiday"
    | "meeting"
    | "other";
  targetAudience: UserRole[];
  isPublic: boolean;
  createdBy: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: String,
    eventType: {
      type: String,
      enum: ["academic", "sports", "cultural", "holiday", "meeting", "other"],
      required: true,
    },
    targetAudience: [{ type: String, enum: Object.values(UserRole) }],
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>("Event", EventSchema);
