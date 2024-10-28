 
import { DbConnect } from "@/database/database";
import SliderModel from "@/model/slider";
import { NextResponse } from "next/server";
 
DbConnect()
export async function GET(req) {
    try {
        
        let result=await SliderModel.find({}) 
        return NextResponse.json({ status: 200, success: true, result });
    } catch (error) {
        return NextResponse.json({status:500,message:'internal server error'})
    }
}
