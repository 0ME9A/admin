import certificate, { CertFace } from "@/models/certificate";
import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect";
import Certificate from "@/models/certificate";

export async function GET() {
  try {
    // Establish MongoDB connection
    await connectMongo();

    // Fetch all certificates from the database
    const certificates = await certificate.find();

    // Return the certificates as a JSON response
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { message: "Error fetching certificates" },
      { status: 500 }
    );
  }
}
// pages/api/admin/certificates.ts
export async function POST(request: Request) {
  try {
    const data: CertFace = await request.json();

    // Remove invalid _id if present
    if (data._id) {
      delete data._id;
    }

    // Validate required fields
    if (!data.name || !data.issueDate || !data.certId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure issueDate is a valid Date
    data.issueDate = new Date(data.issueDate);

    // Connect to MongoDB
    await connectMongo();

    // Create and save new certificate
    const newCertificate = new Certificate(data);
    await newCertificate.save();

    return NextResponse.json(
      { success: true, message: "Certificate created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
