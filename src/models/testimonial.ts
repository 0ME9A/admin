import mongoose, { Schema, Document } from "mongoose";

// Define the interface
export interface TestimonialFace extends Document {
  name: string;
  profession: string;
  message: string;
  rate: number; // Represents rating as a number (e.g., 4.8)
  date: string; // ISO date string
  profile: string; // URL to the profile image
  email: string;
}

// Create the Mongoose schema
const TestimonialSchema = new Schema<TestimonialFace>({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  message: { type: String, required: true },
  rate: { type: Number, required: true, min: 0, max: 5 }, // Rating between 0 and 5
  date: { type: String, default: () => new Date().toISOString() }, // Auto-set to current date on creation
  profile: { type: String, required: true }, // URL for the profile image
  email: { type: String, required: true },
});

// Export the model
export default mongoose.models.Testimonial ||
  mongoose.model<TestimonialFace>("Testimonial", TestimonialSchema);
