import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBookIssue extends Document {
  bookId: Types.ObjectId;
  studentId: Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "issued" | "returned" | "overdue" | "lost";
  fine?: number;
  issuedBy: Types.ObjectId;
  returnedTo?: Types.ObjectId;
}

const BookIssueSchema = new Schema<IBookIssue>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: {
      type: String,
      enum: ["issued", "returned", "overdue", "lost"],
      default: "issued",
    },
    fine: { type: Number, default: 0 },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    returnedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const BookIssue = mongoose.model<IBookIssue>(
  "BookIssue",
  BookIssueSchema
);
