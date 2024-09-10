// users.js (API route)
import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import OtpUserModel from "@/model/otpUser";
import BookingModel from "@/model/bookingModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req) {
    return handelAsyncErrors(async () => {
        let { page, limit, skip } = getPaginationParams(req);

        // Fetch all users with their bookings populated
        let users = await OtpUserModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate({
                path: 'bookings',
                select: 'package_id createdAt',
                populate: {
                    path: 'package_id',
                    select: 'description'
                }
            });


        users = users.map(user => ({
            bookings: user.bookings.length,
            ...user.toObject(),
        }));


        let totalResult = await OtpUserModel.countDocuments();

        return NextResponse.json({
            status: 200,
            success: true,
            users,
            page,
            limit,
            totalResult
        });
    });
}
