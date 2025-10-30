import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransportAssignment extends Document {
  studentId: Types.ObjectId;
  transportId: Types.ObjectId;
  pickupPoint: string;
  monthlyFee: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

const TransportAssignmentSchema = new Schema<ITransportAssignment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    transportId: {
      type: Schema.Types.ObjectId,
      ref: "Transport",
      required: true,
    },
    pickupPoint: { type: String, required: true },
    monthlyFee: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TransportAssignment = mongoose.model<ITransportAssignment>(
  "TransportAssignment",
  TransportAssignmentSchema
);
