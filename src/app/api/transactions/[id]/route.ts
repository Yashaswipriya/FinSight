import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import {Transaction} from "@/models/transaction";
import { Types } from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
  }

  try {
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete transaction" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest,  context: { params: { id: string }}) {
  await connectToDatabase();
  const { id } = context.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
  }

  const body = await req.json();
  const { description, amount, date, category } = body;

  try {
    const updated = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, date, category },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}
