import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import ContactModel from "@/model/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {
    return handelAsyncErrors(async () => {
        
        const { page, limit, skip } = getPaginationParams(req);

      
        const result = await ContactModel.find()
            .populate({
                path: 'package_id',
                select: '_id title'
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        // Count total documents
        const totalResults = await ContactModel.countDocuments();
 
        return NextResponse.json({
            status: 200,
            totalResults,
            result,
            page,
            limit
        });
    });
}
