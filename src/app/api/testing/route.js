// app/api/bookings/route.js
import { DbConnect } from '@/database/database';
import BookingModel from '@/model/bookingModel';
import OtpUserModel from '@/model/otpUser';
import { NextResponse } from 'next/server';

DbConnect();

export async function POST(req) {
    try {
        // Ensure the request body is not empty
         
        // Parse request body
        const { name, email, phone_number, message, package_id } = await req.json();

        // Step 1: Check if the user already exists using the phone number
        let user = await OtpUserModel.findOne({ phoneNumber: phone_number });

        console.log(`user:`, user);

        // Step 2: If user is not found, create a new user and save to OtpUserModel
        if (!user) {
            user = new OtpUserModel({
                registerusername: name,
                email,
                phoneNumber: phone_number,
            });
            await user.save(); // Save the new user
        }

        // Step 3: Create a new booking entry and link to the user (existing or new)
        const newBooking = new BookingModel({
            name,
            email,
            phone_number,
            message,
            package_id,
            user_id: user._id // Reference to the user in the booking model
        });

        await newBooking.save(); // Save the booking entry

        // Return a success response
        return NextResponse.json(
            { message: 'Booking and user saved successfully', booking: newBooking },
            { status: 200 }
        );
    } catch (error) {
        // Handle any errors
        return NextResponse.json(
            { error: 'Error saving booking and user data', details: error.message },
            { status: 500 }
        );
    }}