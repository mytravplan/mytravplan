import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import BookingModel from "@/model/bookingModel";
import { NextResponse } from "next/server";

export async function GET(req) {
    return handelAsyncErrors(async () => {
        let { page, limit, skip } = getPaginationParams(req);

         // Count total documents
    const totalResults = await BookingModel.countDocuments();

        let result = await BookingModel.find()
            .populate({
                path: 'user_id', 
                select: '_id registerusername phoneNumber', 
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

       
        return NextResponse.json({
            status: 200,
            success: true,
            totalResults,
            result,
            page,
            limit
        });
    });
}
