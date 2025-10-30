import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicYear extends Document {
  year: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

const AcademicYearSchema = new Schema<IAcademicYear>(
  {
    year: { type: String, required: true, unique: true }, // e.g., "2024-2025"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AcademicYear = mongoose.model<IAcademicYear>(
  "AcademicYear",
  AcademicYearSchema
);
