 
import { DbConnect } from "@/database/database";
import { SendEmail } from "@/helpers/sendMail";
 
import OtpUserModel from "@/model/otpUser";
import OtpUserAlternateModel from "@/model/otpUserAlternate";
import { NextResponse } from "next/server";

DbConnect() 

export async function POST(req) {
    try {
         
        const { name, email, phone, message } = await req.json();

         
        const existingUser = await OtpUserModel.findOne({ phoneNumber: phone });
        const isPhoneNumberInAlternate = await OtpUserAlternateModel.findOne({ phone });

        if (existingUser || isPhoneNumberInAlternate) {
            return NextResponse.json({ status: 200, message: 'You are already registered! Please log in now.' });
        }

     
        const newUser = new OtpUserModel({ phoneNumber: phone, registerusername: name });
        await newUser.save();

      
        const alternateUser = new OtpUserAlternateModel({ name, email, phone, message });
        await alternateUser.save();

        try {
            await SendEmail({
                email:email,
                registerusername: name,
                phoneNumber: phone,
                message,
                formType: 'user_register_form',
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error sending email' } });
        }

        return NextResponse.json({
            status: 201,
            message: 'User created successfully in both models.',
            result: { newUser, alternateUser }
        });

    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ status: 500, message: 'Server error. Please try again later.' });
    }
}
