import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  type: "boys" | "girls" | "mixed";
  address: string;
  warden: {
    name: string;
    phone: string;
    email: string;
  };
  totalRooms: number;
  occupiedRooms: number;
  facilities: string[];
}

const HostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["boys", "girls", "mixed"], required: true },
    address: { type: String, required: true },
    warden: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    totalRooms: { type: Number, required: true },
    occupiedRooms: { type: Number, default: 0 },
    facilities: [String],
  },
  { timestamps: true }
);

export const Hostel = mongoose.model<IHostel>("Hostel", HostelSchema);
