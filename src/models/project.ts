import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  previewImages: [String],
  status: String,
  projectType: String,
  date: Date,
  address: String,
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
