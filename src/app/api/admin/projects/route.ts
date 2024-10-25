import { NextResponse } from "next/server";

// DELETE /api/projects/:id
export async function GET() {
  return NextResponse.json({ data: "Hey, We are connected with Projects root." });
}
