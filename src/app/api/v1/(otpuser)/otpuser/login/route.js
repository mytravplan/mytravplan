import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { SendEmail } from "@/helpers/sendMail";
import { sendWhatsAppMessage } from "@/helpers/sendWhatsapp";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    
        let payload = await req.json();
        let {phoneNumber,registerusername}=payload
     
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

        // Send Email
        try {
            await SendEmail({
                phoneNumber,
                registerusername,
                formType: 'userlogin'
            });
        } catch (error) {
            console.error('Failed to send email:', error.message);
        }

        // Send WhatsApp message to the user
        try {
            await sendWhatsAppMessage({
                phone_number: phoneNumber,
                templateId: 'user_login',
                bodyValues: {
                    "1": `${registerusername}`,
                    "2": `${phoneNumber}`
                },
            });
        } catch (userMessageError) {
            console.error('Error sending WhatsApp to user:', userMessageError.message);
        }

        // Send WhatsApp message to the admin
        const adminPhoneNumber = process.env.NEXT_PUBLIC_OTPLESS_WHATSAPP_ADMIN_PHONE_NO;
        if (!adminPhoneNumber) {
            console.error("Admin phone number not found in environment variables.");
        } else {
            try {
                await sendWhatsAppMessage({
                    phone_number: adminPhoneNumber,
                    templateId: 'user_login_admin',
                    bodyValues: {
                        "1": `${registerusername}`,
                        "2": `${adminPhoneNumber}`
                    },
                });
            } catch (adminMessageError) {
                console.error('Error sending WhatsApp to admin:', adminMessageError.message);
            }
        }

        return NextResponse.json({
            status: 201,
            success: true,
            message: 'User registered successfully',
            result: newUser
        });
}
