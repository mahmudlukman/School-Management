import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISection extends Document {
  classId: Types.ObjectId;
  name: string; // e.g., "A"
  capacity: number;
  currentStrength: number;
  classTeacherId?: Types.ObjectId;
  room?: string;
}

const SectionSchema = new Schema<ISection>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentStrength: { type: Number, default: 0 },
    classTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    room: String,
  },
  { timestamps: true }
);

export const Section = mongoose.model<ISection>("Section", SectionSchema);
