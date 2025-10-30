import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHomeworkSubmission extends Document {
  homeworkId: Types.ObjectId;
  studentId: Types.ObjectId;
  submissionDate: Date;
  content?: string;
  attachments?: string[];
  marksObtained?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late" | "pending";
}

const HomeworkSubmissionSchema = new Schema<IHomeworkSubmission>(
  {
    homeworkId: {
      type: Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    submissionDate: { type: Date, required: true },
    content: String,
    attachments: [String],
    marksObtained: Number,
    feedback: String,
    status: {
      type: String,
      enum: ["submitted", "graded", "late", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const HomeworkSubmission = mongoose.model<IHomeworkSubmission>(
  "HomeworkSubmission",
  HomeworkSubmissionSchema
);
