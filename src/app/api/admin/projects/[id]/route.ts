import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Project from "@/models/project";

// GET method to retrieve a single project by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const projectId = (await params).id;

    await connectMongo(); // Ensure the database is connected

    // Fetch the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 }); // Return project directly
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const projectId = (await params).id;

    await connectMongo(); // Connect to the database

    // Find and delete the project by its ID
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PUT method to update a project by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the project ID from the URL parameters
    const projectId = (await params).id;
    // Connect to MongoDB
    await connectMongo();

    // Parse the JSON body from the request
    const { title, address, desc, date, projectType, status, previewImages } =
      await req.json();

    // Validate that all required fields are provided
    if (!title || !address || !desc || !date || !projectType || !status) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Prepare the updated data
    const updatedData = {
      title,
      address,
      desc,
      date,
      projectType,
      status,
      previewImages, // Array of images (Base64 strings)
    };

    // Update the project in MongoDB and return the updated document
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    // If the project is not found, return a 404 response
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return the updated project in the response
    return NextResponse.json(
      {
        message: "Project updated successfully",
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
