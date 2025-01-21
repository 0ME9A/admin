import { GalleryFace } from "@/ts/components";
import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Gallery from "@/models/gallery";

// pages/api/admin/gallery.ts// pages/api/admin/gallery.ts
export async function POST(request: Request) {
  try {
    const data: GalleryFace = await request.json();
    // console.log("🚀 ~ POST ~ data:", data)

    // Connect to MongoDB
    await connectMongo(); // Connect to the database

    // Create new gallery
    const newGallery = new Gallery(data);
    await newGallery.save();

    return NextResponse.json(
      { success: true, message: "Gallery created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create gallery" },
      { status: 500 }
    );
  }
}
