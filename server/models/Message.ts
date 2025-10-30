import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../@types/types";

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  senderRole: UserRole;
  recipientId: Types.ObjectId;
  recipientRole: UserRole;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  attachments?: string[];
  parentMessageId?: Types.ObjectId; // For threading
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: Object.values(UserRole), required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    attachments: [String],
    parentMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

MessageSchema.index({ recipientId: 1, isRead: 1 });
MessageSchema.index({ senderId: 1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
