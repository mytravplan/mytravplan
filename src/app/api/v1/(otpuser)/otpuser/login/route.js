import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { SendEmail } from "@/helpers/sendMail";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async () => {
        let payload = await req.formData();
        let phoneNumber = payload.phoneNumber;
        let registerusername = payload.registerusername;
        let existingUser = await OtpUserModel.findOne({ phoneNumber });

        if (existingUser) {
            return NextResponse.json({
                status: 200,
                success: true,
                message: 'User logged in successfully',
            });
        }

        let newUser = new OtpUserModel({ phoneNumber, registerusername });

        await newUser.save();

        try {
            await SendEmail({
                phoneNumber,
                registerusername,
                formType: 'userlogin'
            });
        } catch (error) {
            console.error('Failed to send email:', error.message);
        }

        return NextResponse.json({
            status: 201,
            success: true,
            message: 'User registered successfully',
            result: newUser
        });
    });
}
