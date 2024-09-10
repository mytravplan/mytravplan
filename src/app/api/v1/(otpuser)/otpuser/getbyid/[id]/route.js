// users.js (API route)
import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import BookingModel from "@/model/bookingModel";
import { NextResponse } from "next/server";
import { getPaginationParams } from "@/helpers/paginations";

DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params; 
        let { page, limit, skip } = getPaginationParams(req);

        // Fetch the user by ID with populated bookings and package details
        const user = await OtpUserModel.findById(id)
            .populate({
                path: 'bookings',
                select: 'package_id createdAt',
                populate: {
                    path: 'package_id',
                    select: 'description'  
                }
            });

        // If user is not found, return a 404 error
        if (!user) {
            return NextResponse.json({
                status: 404,
                success: false,
                message: 'User not found'
            });
        }

        // Paginate bookings
        const totalBookings = user.bookings.length; // Total number of bookings
        const paginatedBookings = user.bookings.slice(skip, skip + limit);

        // Transform user data with paginated booking details
        const result = {
            _id: user._id,
            registerusername: user.registerusername,
            phoneNumber: user.phoneNumber,
            role: user.role,
            totalBookings,
            bookings: paginatedBookings.map(booking => ({
                booking_id: booking._id,
                _id: booking.package_id._id,
                description: booking.package_id.description,
                createdAt: booking.createdAt
            })),
            page,
            limit,
           
            
        };
        return NextResponse.json({
            status: 200,
            success: true,
            result,
           
        });
    });
}
