import { NextResponse } from 'next/server';

export async function POST(request) {
    const { phoneNumber, channel = 'SMS', otpLength = 6, expiry = 10 } = await request.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_OTPLESS_URL}/auth/otp/v1/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'clientId': process.env.NEXT_PUBLIC_CLIENT_ID,
                'clientSecret': process.env.NEXT_PUBLIC_CLIENT_SECRET,
            },
            body: JSON.stringify({
                phoneNumber,
                channel,
                otpLength,
                expiry,
            }),
        });

        const result = await response.json();

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Internal server issue' }, { status: 500 });
    }
}