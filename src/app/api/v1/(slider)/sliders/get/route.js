 
import { DbConnect } from "@/database/database";
import SliderModel from "@/model/slider";
import { NextResponse } from "next/server";
 
DbConnect()
export async function GET(req) {
    let result=await SliderModel.find({})
    console.log(result)
    return NextResponse.json({ status: 200, success: true, result });
}
