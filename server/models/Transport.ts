import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransport extends Document {
  vehicleNumber: string;
  vehicleType: "bus" | "van" | "car";
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  routeNumber: string;
  routeName: string;
  pickupPoints: {
    location: string;
    time: string;
  }[];
  isActive: boolean;
}

const TransportSchema = new Schema<ITransport>(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ["bus", "van", "car"], required: true },
    capacity: { type: Number, required: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    driverLicense: { type: String, required: true },
    routeNumber: { type: String, required: true },
    routeName: { type: String, required: true },
    pickupPoints: [
      {
        location: String,
        time: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Transport = mongoose.model<ITransport>(
  "Transport",
  TransportSchema
);
