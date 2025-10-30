import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHostelRoom extends Document {
  hostelId: Types.ObjectId;
  roomNumber: string;
  roomType: "single" | "double" | "triple" | "dormitory";
  capacity: number;
  currentOccupancy: number;
  floor: number;
  monthlyFee: number;
  isAvailable: boolean;
}

const HostelRoomSchema = new Schema<IHostelRoom>(
  {
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    roomNumber: { type: String, required: true },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "dormitory"],
      required: true,
    },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    floor: { type: Number, required: true },
    monthlyFee: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HostelRoom = mongoose.model<IHostelRoom>(
  "HostelRoom",
  HostelRoomSchema
);
