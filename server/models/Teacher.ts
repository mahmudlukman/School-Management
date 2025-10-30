import mongoose, { Schema, Document, Types } from "mongoose";
import { Gender, IPhoto } from "../@types/types";

export interface ITeacher extends Document {
  userId: Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: number;
  joiningDate: Date;
  subjects: Types.ObjectId[];
  classes: Types.ObjectId[];
  salary: number;
  photo?: IPhoto;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, default: 0 },
    joiningDate: { type: Date, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
    salary: { type: Number, required: true },
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
  },
  { timestamps: true }
);


export const Teacher = mongoose.model<ITeacher>("Teacher", TeacherSchema);
