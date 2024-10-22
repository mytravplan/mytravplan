import { DbConnect } from "@/database/database";
import { getPaginationParams } from "@/helpers/paginations";
import TestimonialsModel from "@/model/testimonialsModel";
import { NextResponse } from "next/server";

 

DbConnect();

export async function GET(req) {
    let { page, limit, skip } = getPaginationParams(req);
    try {
        const result = await TestimonialsModel.find({}).skip(skip).limit(limit)
        .limit(limit);
        let totalResult=await TestimonialsModel.countDocuments()
        return NextResponse.json({ status: 200, success: true, totalResult,result,page,limit });
    } catch (error) {
        return NextResponse.json({ status: 500, success: false, message: 'Failed to fetch testimonials', error: error.message });
    }
}
