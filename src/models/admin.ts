import mongoose, { Document, Schema } from "mongoose";

interface Admin extends Document {
  email: string;
  password: string;
}

const AdminSchema = new Schema<Admin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AdminModel =
  mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

export default AdminModel;
