// models/Gallery.ts
import mongoose, { Schema, Document } from "mongoose";

export interface GalleryFace extends Document {
  title: string;
  desc: string;
  previewImages: string[]; // Array to store Base64 image strings
}

const GallerySchema = new Schema<GalleryFace>(
  {
    title: { type: String, required: true }, // Title is required and must be a string
    desc: { type: String, required: true }, // Description is required and must be a string
    previewImages: { type: [String], default: [] }, // Array of image strings, default is an empty array
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: "galleries", // Set collection name to "galleries"
  }
);

export default mongoose.models.Gallery ||
  mongoose.model<GalleryFace>("Gallery", GallerySchema);
