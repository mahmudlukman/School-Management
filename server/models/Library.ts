import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishedYear?: number;
  category: string;
  quantity: number;
  availableQuantity: number;
  price: number;
  location?: string; // Shelf/Rack info
  description?: string;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publisher: String,
  publishedYear: Number,
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  price: { type: Number, required: true },
  location: String,
  description: String
}, { timestamps: true });

export const Book = mongoose.model<IBook>('Book', BookSchema);