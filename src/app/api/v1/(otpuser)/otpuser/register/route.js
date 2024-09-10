import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async () => {
        let payload = await req.json();
        let phoneNumber = payload.phoneNumber;
        let name = payload.name;
        let existingUser = await OtpUserModel.findOne({ phoneNumber });

        if (existingUser) {
            return NextResponse.json({
                status: 200,
                success: true,
                message: ' user logged in successfully',
            });
        }

        let newUser = new OtpUserModel({ phoneNumber,name });

        await newUser.save();

        return NextResponse.json({
            status: 201,
            success: true,
            message: 'User registered successfully',
            result: newUser
        });
    });
}
