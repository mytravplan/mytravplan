import { DbConnect } from "@/database/database";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { orderId, otp, phoneNumber } = await request.json();
  
    try {
        // Verify OTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_OTPLESS_URL}/auth/otp/v1/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'clientId': process.env.NEXT_PUBLIC_CLIENT_ID,
                'clientSecret': process.env.NEXT_PUBLIC_CLIENT_SECRET,
            },
            body: JSON.stringify({ orderId, otp, phoneNumber }),
        });

        const result = await response.json();

        return NextResponse.json(result)

     

         
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Internal server issue' }, { status: 500 });
    }
}
