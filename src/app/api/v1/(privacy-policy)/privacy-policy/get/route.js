import { DbConnect } from "@/database/database";
import privacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";
DbConnect()
export async function GET() {
    try {
      const result = await privacyPolicy.find({}).lean();  
      return NextResponse.json({ result });
    } catch (error) {
      return NextResponse.json({ error: "Failed to retrieve data", details: error.message }, { status: 500 });
    }
  }