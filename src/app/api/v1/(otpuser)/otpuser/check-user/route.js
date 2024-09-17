import { DbConnect } from "@/database/database";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        const { phoneNumber } = await req.json();

        // Check if user exists in the database
        const existingUser = await OtpUserModel.findOne({ phoneNumber });

        if (existingUser) {
            // User exists, return the username
            return NextResponse.json({
                status: 200,
                success: true,
                userExists: true,
                registerusername: existingUser.registerusername,
            });
        } else {
            // User does not exist, prompt for name input
            return NextResponse.json({
                status: 200,
                success: true,
                userExists: false,
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Error checking user",
            error: error.message,
        });
    }
}
