import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Gallery from "@/models/gallery";

// GET method to retrieve a single gallery by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const galleryId = (await params).id;

    await connectMongo(); // Ensure the database is connected

    // Fetch the gallery by ID
    const gallery = await Gallery.findById(galleryId);

    if (!gallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery, { status: 200 }); // Return gallery directly
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const galleryId = (await params).id;

    await connectMongo(); // Connect to the database

    // Find and delete the gallery by its ID
    const deletedGallery = await Gallery.findByIdAndDelete(galleryId);

    if (!deletedGallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Gallery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete gallery" },
      { status: 500 }
    );
  }
}

// PUT method to update a gallery by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the gallery ID from the URL parameters
    const galleryId = (await params).id;
    // Connect to MongoDB
    await connectMongo();

    // Parse the JSON body from the request
    const { title, desc, previewImages } = await req.json();

    // Validate that all required fields are provided
    if (!title || !desc) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Prepare the updated data
    const updatedData = {
      title,
      desc,
      previewImages, // Array of images (Base64 strings)
    };

    // Update the gallery in MongoDB and return the updated document
    const updatedGallery = await Gallery.findByIdAndUpdate(
      galleryId,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    // If the gallery is not found, return a 404 response
    if (!updatedGallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Return the updated gallery in the response
    return NextResponse.json(
      {
        message: "Gallery updated successfully",
        gallery: updatedGallery,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}
