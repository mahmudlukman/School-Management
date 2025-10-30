import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  classId: Types.ObjectId;
  teacherId?: Types.ObjectId;
  totalMarks?: number;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    totalMarks: Number,
  },
  { timestamps: true }
);

export const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);
