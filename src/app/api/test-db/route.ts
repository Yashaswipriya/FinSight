// src/app/api/test-db/route.ts

import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ success: true, message: "Connected to MongoDB " });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({ success: false, message: "Connection failed " }, { status: 500 });
  }
}
