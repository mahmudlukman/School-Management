import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHostelAssignment extends Document {
  studentId: Types.ObjectId;
  hostelId: Types.ObjectId;
  roomId: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  monthlyFee: number;
  isActive: boolean;
}

const HostelAssignmentSchema = new Schema<IHostelAssignment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "HostelRoom", required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    monthlyFee: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HostelAssignment = mongoose.model<IHostelAssignment>(
  "HostelAssignment",
  HostelAssignmentSchema
);
