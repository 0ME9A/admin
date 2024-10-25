import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Project from "@/models/project";

// GET method to retrieve a single project by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo(); // Ensure the database is connected

    const projectId = params.id;

    // Fetch the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
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
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo(); // Connect to the database

    const { id } = params;

    // Find and delete the project by its ID
    const deletedProject = await Project.findByIdAndDelete(id);

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo(); // Connect to the database

    const { id } = params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("desc") as string;
    const status = formData.get("status") as string;
    const date = formData.get("date") as string;
    const address = formData.get("address") as string;

    const updatedData = {
      title,
      description,
      status,
      date,
      address,
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
