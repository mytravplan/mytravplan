import { DbConnect } from "@/database/database";
import { SendEmail } from "@/helpers/sendMail";
import { ErrorReporter } from "@/helpers/vinevalidations/errorreporter";
import { contactSchema, QUERY_FORM_UNTI_TAG } from "@/helpers/vinevalidations/validators";
import PackagesModel from "@/model/packagesModel";
import ContactModel from "@/model/userModel";
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
        let form_unit_tag = payload.get('form_unit_tag');

        // Check form_unit_tag
        if (form_unit_tag !== QUERY_FORM_UNTI_TAG) {
            return NextResponse.json({ status: 404, success: false, errors: { message: 'please provide valid form unit tag' } });
        }

        // Validate data
        let data = { name, email, phone_number, message, form_unit_tag };
        const validator = vine.compile(contactSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(data);

      
        

        // Create new contact document
        let result = new ContactModel({
            name: output.name,
            email: output.email,
            phone_number: output.phone_number,
            message: output.message,
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
                formType: 'contact',
            
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return NextResponse.json({ status: 500, success: false, errors: { message: 'Error sending email' } });
        }

        // Return response with package details if available
        return NextResponse.json({
            success: true,
            message: `Dear ${output.name} your query sent successfully`
                
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
