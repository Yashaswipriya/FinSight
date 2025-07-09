import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/models/transaction";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { description, amount, date, category } = body;

    if (!description || !amount || !date || !category) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({ description, amount, date, category });

    return NextResponse.json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
