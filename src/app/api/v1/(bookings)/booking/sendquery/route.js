import { DbConnect } from "@/database/database";
import { SendEmail } from "@/helpers/sendMail";
import { ErrorReporter } from "@/helpers/vinevalidations/errorreporter";
import { BOOKINGS_FORM_UNTI_TAG, bookingSchema } from "@/helpers/vinevalidations/validators";
import BookingModel from "@/model/bookingModel";

import PackagesModel from "@/model/packagesModel";
import vine, { errors } from "@vinejs/vine";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        // Extract form data
        let payload = await req.formData();
        let name = payload.get('name');
        let email = payload.get('email');
        let phone_number = payload.get('phone_number');
        let message = payload.get('message');
        let package_id = payload.get('package_id');
        let user_id = payload.get('user_id');
        let form_unit_tag = payload.get('form_unit_tag');

        // Check form_unit_tag
        if (form_unit_tag !== BOOKINGS_FORM_UNTI_TAG) {
            return NextResponse.json({ status: 404, success: false, errors: { message: 'please provide valid form unit tag' } });
        }

        // Validate data
        let data = { name, email, phone_number, message, package_id, form_unit_tag };
        const validator = vine.compile(bookingSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(data);

        // Fetch package details
        let packageDetails = null;
        if (package_id) {
            packageDetails = await PackagesModel.findById(package_id).select('_id title slug');
        }

        // Create new contact document
        let result = new BookingModel({
            name: output.name,
            email: output.email,
            phone_number: output.phone_number,
            message: output.message,
            package_id: output.package_id,
            user_id:user_id
        });

        // Save document to database
        try {
            await result.save();
        } catch (dbError) {
            console.error('Error saving to database:', dbError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error saving to database' } });
        }

        // Send email with package details
        try {
            await SendEmail({
                ...output,
                formType: 'booking',
                packageDetails  
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error sending email' } });
        }

        // Return response with package details if available
        return NextResponse.json({
            success: true,
            message: packageDetails 
                ? `Dear ${output.name}, your query for the package '${packageDetails.title}' was sent successfully!` 
                : `Dear ${output.name}, your query was sent successfully!`
        });

    } catch (error) {
        // Handle validation errors
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, success: false, errors: error.messages });
        } else {
            // Handle other types of errors
            console.error('Unexpected error:', error.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'An unexpected error occurred' } });
        }
    }
}
