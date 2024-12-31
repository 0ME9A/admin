// models/Project.ts
import mongoose, { Schema, Document } from "mongoose";

export interface CertFace extends Document {
  title: string;
  name: string;
  desc: string;
  certId: string;
  certSrc: string;
  issueDate: Date; // Ensure consistency with the schema
}

const CertificateSchema = new Schema<CertFace>(
  {
    title: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    certId: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^[A-Z0-9]+$/.test(v); // Example: Only uppercase letters and numbers
        },
        message: (props) => `${props.value} is not a valid certId!`,
      },
    },
    certSrc: { type: String, required: true },
    issueDate: { type: Date, required: true }, // Matches CertFace
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<CertFace>("Certificate", CertificateSchema);

export default Certificate;
