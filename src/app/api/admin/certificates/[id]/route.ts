import { NextResponse } from "next/server";
import Certificate from "@/models/certificate";
import connectMongo from "@/utils/connect";

// GET method: Retrieve a single certificate by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: certId } = params;

    await connectMongo(); // Ensure database connection

    // Fetch the certificate by ID
    const certificate = await Certificate.findById(certId);

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

// DELETE method: Delete a certificate by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: certificateId } = params;

    await connectMongo(); // Ensure database connection

    // Find and delete the certificate
    const deletedCertificate = await Certificate.findByIdAndDelete(
      certificateId
    );

    if (!deletedCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}

// PUT method: Update a certificate by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectMongo(); // Ensure database connection

    // Parse JSON request body
    const { title, name, desc, certSrc, issueDate } = await req.json();

    // Validate required fields
    if (!title || !name || !desc || !certSrc) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Prepare updated data
    const updatedData = {
      title,
      name,
      desc,
      certSrc,
      issueDate,
    };

    // Update certificate and return updated document
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Certificate updated successfully",
        certificate: updatedCertificate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}
