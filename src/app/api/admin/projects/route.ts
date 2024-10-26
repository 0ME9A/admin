import { ProjectFace } from "@/models/project";
import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Project from "@/models/project";

// pages/api/admin/projects.ts// pages/api/admin/projects.ts
export async function POST(request: Request) {
  try {
    const data: ProjectFace = await request.json();

    // Connect to MongoDB
    await connectMongo(); // Connect to the database

    // Create new project
    const newProject = new Project(data);
    await newProject.save();

    return NextResponse.json(
      { success: true, message: "Project created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}