 
 
import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";;
import Transfer from "@/model/TransferModel";
import { NextResponse } from "next/server";
export async function GET(req) {

  return handelAsyncErrors(async () => {
      await DbConnect()
    const { page, limit, skip } = getPaginationParams(req);
    const results = await Transfer.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
    const totalResults = await Transfer.countDocuments();
    return NextResponse.json({
      status: 200,
      totalResults,
      results,
      page,
      limit,
    });
  });
}
