import mongoose, { Schema, Document, Types } from "mongoose";
import { Gender, IPhoto } from "../@types/types";

export interface IStudent extends Document {
  userId: Types.ObjectId;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string;
  religion?: string;
  nationality: string;
  address: string;
  phone?: string;
  email?: string;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  rollNumber: number;
  admissionDate: Date;
  photo?: IPhoto;
  parentIds: Types.ObjectId[];
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  previousSchool?: string;
  status: "active" | "inactive" | "graduated" | "transferred";
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admissionNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    bloodGroup: String,
    religion: String,
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    email: String,
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    rollNumber: { type: Number, required: true },
    admissionDate: { type: Date, required: true },
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    parentIds: [{ type: Schema.Types.ObjectId, ref: "Parent" }],
    medicalInfo: {
      allergies: [String],
      medications: [String],
      conditions: [String],
    },
    previousSchool: String,
    status: {
      type: String,
      enum: ["active", "inactive", "graduated", "transferred"],
      default: "active",
    },
  },
  { timestamps: true }
);

StudentSchema.index({ classId: 1, sectionId: 1 });
StudentSchema.index({ status: 1 });

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
