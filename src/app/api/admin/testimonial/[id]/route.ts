import { NextResponse } from "next/server";
import Testimonial, { TestimonialFace } from "@/models/testimonial";
import connectMongo from "@/utils/connect";

// GET method to retrieve a single testimonial by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo(); // Ensure the database is connected

    const testimonialId = params.id;

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
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo(); // Connect to the database

    const { id } = params;

    // Find and delete the testimonial by its ID
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

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

// // app/api/admin/testimonial/[id]/route.ts
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Connect to MongoDB
//     await connectMongo();

//     // Get the project ID from the URL parameters
//     const { id } = params;

//     // Parse the JSON body from the request
//     const { name, profession, message, rate, profile } = await req.json();

//     // Validate that all required fields are provided
//     if (!name || !profession || !message || !rate || !profile) {
//       return NextResponse.json(
//         { error: "All required fields must be provided" },
//         { status: 400 }
//       );
//     }

//     // Prepare the updated data
//     const updatedData = { name, profession, message, rate, profile };

//     // Update the testimonial in MongoDB and return the updated document
//     const updatedTestimonial = await Testimonial.findByIdAndUpdate(
//       id,
//       updatedData,
//       {
//         new: true, // Return the updated document
//       }
//     );

//     // If the testimonial is not found, return a 404 response
//     if (!updatedTestimonial) {
//       return NextResponse.json(
//         { error: "Testimonial not found" },
//         { status: 404 }
//       );
//     }

//     // Return the updated testimonial in the response
//     return NextResponse.json(
//       {
//         message: "Testimonial updated successfully",
//         project: updatedTestimonial,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating testimonial:", error);
//     return NextResponse.json(
//       { error: "Failed to update testimonial" },
//       { status: 500 }
//     );
//   }
// }

// app/api/admin/testimonial/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectMongo();

    const { id } = params;
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
      id,
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
