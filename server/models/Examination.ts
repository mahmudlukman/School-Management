import mongoose, { Schema, Document, Types } from "mongoose";
import { ExamType } from "../@types/types";

export interface IExam extends Document {
  name: string;
  type: ExamType;
  classId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalMarks: number;
  passingMarks: number;
  description?: string;
}

const ExamSchema = new Schema<IExam>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(ExamType), required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    description: String,
  },
  { timestamps: true }
);

export const Exam = mongoose.model<IExam>("Exam", ExamSchema);
