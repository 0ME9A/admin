// models/Project.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ProjectFace extends Document {
  title: string;
  address: string;
  desc: string;
  date: string;
  projectType: string[];
  status: "completed" | "ongoing" | string;
  previewImages: string[]; // Array to store Base64 image strings
}

const ProjectSchema = new Schema<ProjectFace>({
  title: { type: String, required: true },
  address: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: String, required: true },
  projectType: { type: [String], required: true },
  status: { type: String, required: true },
  previewImages: { type: [String], default: [] },
});

export default mongoose.models.Project ||
  mongoose.model<ProjectFace>("Project", ProjectSchema);
