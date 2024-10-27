import { TestimonialFace } from "@/ts/components";
import { NextResponse } from "next/server";
import Testimonial from "@/models/testimonial";
import connectMongo from "@/utils/connect";

export async function POST(request: Request) {
  try {
    const data: TestimonialFace = await request.json();

    // Connect to MongoDB
    await connectMongo();

    // Check if a testimonial with the same email already exists
    const existingTestimonial = await Testimonial.findOne({
      email: data.email,
    });
    if (existingTestimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "A testimonial with this email already exists",
        },
        { status: 409 }
      );
    }

    // Create new testimonial
    const newTestimonial = new Testimonial(data);
    await newTestimonial.save();

    return NextResponse.json(
      { success: true, message: "Testimonial created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
