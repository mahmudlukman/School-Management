import mongoose, { Schema, Document, Types } from "mongoose";

export interface IResult extends Document {
  studentId: Types.ObjectId;
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  remarks?: string;
  teacherId: Types.ObjectId;
}

const ResultSchema = new Schema<IResult>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    grade: String,
    remarks: String,
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

ResultSchema.index({ studentId: 1, examId: 1 });
ResultSchema.index({ examId: 1, subjectId: 1 });

export const Result = mongoose.model<IResult>("Result", ResultSchema);
