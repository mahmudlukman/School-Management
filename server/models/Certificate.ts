import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICertificate extends Document {
  studentId: Types.ObjectId;
  certificateType:
    | "transfer"
    | "character"
    | "bonafide"
    | "completion"
    | "other";
  issueDate: Date;
  certificateNumber: string;
  purpose?: string;
  issuedBy: Types.ObjectId;
  content?: string;
  status: "active" | "revoked";
}

const CertificateSchema = new Schema<ICertificate>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    certificateType: {
      type: String,
      enum: ["transfer", "character", "bonafide", "completion", "other"],
      required: true,
    },
    issueDate: { type: Date, required: true },
    certificateNumber: { type: String, required: true, unique: true },
    purpose: String,
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
    status: { type: String, enum: ["active", "revoked"], default: "active" },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>(
  "Certificate",
  CertificateSchema
);
