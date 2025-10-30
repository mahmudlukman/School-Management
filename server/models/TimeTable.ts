import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITimetable extends Document {
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  schedule: {
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday";
    periods: {
      periodNumber: number;
      startTime: string;
      endTime: string;
      subjectId: Types.ObjectId;
      teacherId: Types.ObjectId;
      room?: string;
    }[];
  }[];
}

const TimetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        },
        periods: [
          {
            periodNumber: Number,
            startTime: String,
            endTime: String,
            subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
            teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
            room: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Timetable = mongoose.model<ITimetable>(
  "Timetable",
  TimetableSchema
);
