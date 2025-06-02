

import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import Transfer from "@/model/TransferModel";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  return handelAsyncErrors(async () => {
    const { slug } = params;
    await DbConnect
    const result = await Transfer.findOne({ transfer_slug:slug });
    if (!result) {
      return NextResponse.json(
        { status: 404, message: "Transfer not found." },

      );
    }
    return NextResponse.json({ status: 200, result });
  });
}
