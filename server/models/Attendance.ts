import mongoose, { Schema, Document, Types } from "mongoose";
import { AttendanceStatus } from "../@types/types";

export interface IAttendance extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: Types.ObjectId;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    remarks: String,
    markedBy: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ studentId: 1, date: -1 });
AttendanceSchema.index({ classId: 1, sectionId: 1, date: -1 });

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
