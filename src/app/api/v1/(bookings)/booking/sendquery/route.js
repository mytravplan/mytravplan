import { DbConnect } from "@/database/database";
import { SendEmail } from "@/helpers/sendMail";
import { sendWhatsAppMessage } from "@/helpers/sendWhatsapp";
import { ErrorReporter } from "@/helpers/vinevalidations/errorreporter";
import { BOOKINGS_FORM_UNTI_TAG, bookingSchema } from "@/helpers/vinevalidations/validators";
import BookingModel from "@/model/bookingModel";
import PackagesModel from "@/model/packagesModel";
import vine, { errors } from "@vinejs/vine";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        let payload = await req.formData();
        let name = payload.get('name');
        let email = payload.get('email');
        let phone_number = payload.get('phone_number');
        let message = payload.get('message');
        let package_id = payload.get('package_id');
        let user_id = payload.get('user_id');
        let form_unit_tag = payload.get('form_unit_tag');

        if (form_unit_tag !== BOOKINGS_FORM_UNTI_TAG) {
            return NextResponse.json({ status: 404, success: false, errors: { message: 'Invalid form unit tag' } });
        }

        let data = { name, email, phone_number, message, package_id, form_unit_tag };
        const validator = vine.compile(bookingSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(data);

        let packageDetails = null;
        if (package_id) {
            packageDetails = await PackagesModel.findById(package_id).select('_id title slug');
        }

        let result = new BookingModel({
            name: output.name,
            email: output.email,
            phone_number: output.phone_number,
            message: output.message,
            package_id: output.package_id,
            user_id: user_id,
        });

        try {
            await result.save();
        } catch (dbError) {
            console.error('Database save error:', dbError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error saving to database' } });
        }

        try {
            await SendEmail({
                ...output,
                formType: 'booking',
                packageDetails,
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error sending email' } });
        }

        // Send WhatsApp message to the user
        try {
            await sendWhatsAppMessage({
                phone_number: output.phone_number,
                templateId: 'booking_template_sa',
                bodyValues: {
                    "1": `Hi ${output.name}`,
                    "2": `Your query for the package '${packageDetails ? packageDetails.title : 'No package details'}' was sent successfully!`
                },
            });
        } catch (userMessageError) {
            console.error('Error sending WhatsApp to user:', userMessageError.message);
        }

        // Send WhatsApp message to the admin
        const adminPhoneNumber = process.env.NEXT_PUBLIC_OTPLESS_WHATSAPP_ADMIN_PHONE_NO;
        try {
            await sendWhatsAppMessage({
                phone_number: adminPhoneNumber,
                templateId: 'booking_template_admin',
                bodyValues: {
                    "1": `Name ${output.name}`,
                    "2":`Phone No. ${output.phone_number}`,
                    "3": packageDetails ? packageDetails.title : "No package details available"
                },
            });
        } catch (adminMessageError) {
            console.error('Error sending WhatsApp to admin:', adminMessageError.message);
        }

        return NextResponse.json({
            success: true,
            message: packageDetails
                ? `Dear ${output.name}, your query for the package '${packageDetails.title}' was sent successfully!`
                : `Dear ${output.name}, your query was sent successfully!`,
        });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, success: false, errors: error.messages });
        } else {
            console.error('Unexpected error:', error.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'An unexpected error occurred' } });
        }
    }
}

