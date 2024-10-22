import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import VideosModel from "@/model/videoModel";
import { NextResponse } from "next/server";

 
DbConnect()
export async function GET(req,) {
    return handelAsyncErrors(async () => {
        let { page, limit, skip } = getPaginationParams(req);
        const result = await VideosModel.find({}).limit(limit).skip(skip);
        if (!result) {
            return NextResponse.json({ success: false, message: 'Videos not found' }, { status: 404 });
        }
        let totalResults=await VideosModel.countDocuments()
        return NextResponse.json({
            success: true,
            totalResults,
            result,
            page,
            limit,
        }, { status: 200 });
    });
}
