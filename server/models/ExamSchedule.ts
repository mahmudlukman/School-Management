import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExamSchedule extends Document {
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  room?: string;
  maxMarks: number;
  duration: number; // in minutes
}

const ExamScheduleSchema = new Schema<IExamSchedule>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: String,
    maxMarks: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ExamSchedule = mongoose.model<IExamSchedule>(
  "ExamSchedule",
  ExamScheduleSchema
);
