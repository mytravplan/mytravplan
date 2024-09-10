import { DbConnect } from "@/database/database";
import FooterModel from "@/model/footerModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await DbConnect();
    const result = await FooterModel.find().sort({ createdAt: -1 });
    if (!result || result.length === 0) {
      return NextResponse.json({ status: 200, message: 'No records available', result: [] });
    }
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("Error fetching footer details:", error);
    return NextResponse.json({ status: 500, message: 'Internal server error' });
  }
}
