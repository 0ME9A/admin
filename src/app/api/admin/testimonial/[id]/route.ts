import { NextResponse } from "next/server";
import Testimonial, { TestimonialFace } from "@/models/testimonial";
import connectMongo from "@/utils/connect";

// GET method to retrieve a single testimonial by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo(); // Ensure the database is connected

    const testimonialId = (await params).id;

    // Fetch the testimonial by ID
    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial, { status: 200 }); // Return testimonial directly
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo(); // Connect to the database

    const projectId = (await params).id;

    // Find and delete the testimonial by its ID
    const deletedTestimonial = await Testimonial.findByIdAndDelete(projectId);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

// PUT method to update a testimonial by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await connectMongo();

    const testimonialId = (await params).id;

    const { name, profession, message, rate, profile } = await req.json();

    // Validate required fields
    if (!name || !profession || !message || !rate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare the updated data, skipping fields that aren't provided
    const updatedData: Partial<TestimonialFace> = {};
    if (name) updatedData.name = name;
    if (profession) updatedData.profession = profession;
    if (message) updatedData.message = message;
    if (rate) updatedData.rate = rate;
    if (profile) updatedData.profile = profile;

    // Update and return the updated document
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonialId,
      updatedData,
      { new: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial updated successfully",
        testimonial: updatedTestimonial,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
