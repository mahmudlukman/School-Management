import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHomework extends Document {
  title: string;
  description: string;
  subjectId: Types.ObjectId;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  teacherId: Types.ObjectId;
  assignedDate: Date;
  dueDate: Date;
  maxMarks?: number;
  attachments?: string[];
}

const HomeworkSchema = new Schema<IHomework>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    assignedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    maxMarks: Number,
    attachments: [String],
  },
  { timestamps: true }
);

export const Homework = mongoose.model<IHomework>("Homework", HomeworkSchema);
