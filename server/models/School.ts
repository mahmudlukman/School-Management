import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISchool extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  establishedYear: number;
  principalId?: Types.ObjectId;
  logo?: string;
  motto?: string;
  settings: {
    academicYearStart: Date;
    academicYearEnd: Date;
    sessionTimings: { start: string; end: string };
    currency: string;
  };
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    establishedYear: Number,
    principalId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    logo: String,
    motto: String,
    settings: {
      academicYearStart: Date,
      academicYearEnd: Date,
      sessionTimings: { start: String, end: String },
      currency: { type: String, default: "USD" },
    },
  },
  { minimize: false, timestamps: true }
);

export const School = mongoose.model<ISchool>("School", SchoolSchema);
