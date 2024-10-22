import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import VideosModel from "@/model/videoModel";
import { NextResponse } from "next/server";
DbConnect()
export async function GET(req, { params }) {
    const { id } = params;

    return handelAsyncErrors(async () => {
        const result = await VideosModel.findById(id);
        if (!result) {
            return NextResponse.json({ success: false, message: 'Video not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            result,
        }, { status: 200 });
    });
}
