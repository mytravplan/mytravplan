import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import Transfer from "@/model/TransferModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    await DbConnect()
  return handelAsyncErrors(async () => {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, message: "Invalid transfer ID." },
        
      );
    }

    const deleted = await Transfer.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { status: 404, message: "Transfer not found." }
      );
    }
    return NextResponse.json({ status: 200, message: "Transfer deleted." });
  });
}