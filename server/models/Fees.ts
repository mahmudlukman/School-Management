import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeeStructure extends Document {
  name: string;
  classId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  amount: number;
  dueDate: Date;
  feeType:
    | "tuition"
    | "admission"
    | "exam"
    | "transport"
    | "library"
    | "sports"
    | "other";
  description?: string;
}

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    feeType: {
      type: String,
      enum: [
        "tuition",
        "admission",
        "exam",
        "transport",
        "library",
        "sports",
        "other",
      ],
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

export const FeeStructure = mongoose.model<IFeeStructure>(
  "FeeStructure",
  FeeStructureSchema
);
