import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClass extends Document {
  name: string; // e.g., "Grade 10"
  level: number;
  sections: string[]; // e.g., ["A", "B", "C"]
  capacity: number;
  classTeacherId?: Types.ObjectId;
  academicYearId: Types.ObjectId;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true },
    sections: [String],
    capacity: { type: Number, required: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
  },
  { timestamps: true }
);

export const Class = mongoose.model<IClass>("Class", ClassSchema);
