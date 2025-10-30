import mongoose, { Schema, Document, Types } from "mongoose";
import { IPhoto } from "../@types/types";

export interface IParent extends Document {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  relationship: "father" | "mother" | "guardian";
  phone: string;
  email: string;
  occupation?: string;
  address: string;
  studentIds: Types.ObjectId[];
  photo?: IPhoto;
}

const ParentSchema = new Schema<IParent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    relationship: {
      type: String,
      enum: ["father", "mother", "guardian"],
      required: true,
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    occupation: String,
    address: { type: String, required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const Parent = mongoose.model<IParent>("Parent", ParentSchema);
