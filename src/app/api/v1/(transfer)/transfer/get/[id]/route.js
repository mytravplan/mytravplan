 

import { handelAsyncErrors } from "@/helpers/asyncErrors";
 
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Transfer from "@/model/TransferModel";
import { DbConnect } from "@/database/database";
 



export async function GET(req, { params }) {
  await DbConnect()
  return handelAsyncErrors(async () => {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, message: "Invalid transfer ID." },
       
      );
    }

    const result = await Transfer.findById(id);
    if (!result) {
      return NextResponse.json(
        { status: 404, message: "Transfer not found." },
        
      );
    }

    return NextResponse.json({ status: 200, result });
  });
}













