import { DbConnect } from "@/database/database";
import { SendEmail } from "@/helpers/sendMail";
import { ErrorReporter } from "@/helpers/vinevalidations/errorreporter";
import { FLIGHT_FORM_UNTI_TAG, flightsSchema } from "@/helpers/vinevalidations/validators";
import FlightModel from "@/model/fligthModel";
import vine, { errors } from "@vinejs/vine";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        // Parse form data
        let payload = await req.formData();
        let name = payload.get('name');
        let email = payload.get('email');
        let phone_number = payload.get('phone_number');
        let date = payload.get('date');
        let origin = payload.get('origin');
        let destination = payload.get('destination');
        let traveler = payload.get('traveler');
        let children = payload.get('children');
        let message = payload.get('message');
        let form_unit_tag = payload.get('form_unit_tag')

        if (form_unit_tag !== FLIGHT_FORM_UNTI_TAG) {
            return NextResponse.json({ status: 400, success: false, errors: { message: 'please provide valid form unit tag' } });
        }

        // Prepare data for validation
        let data = { name, email, phone_number, date, origin, destination, traveler, children, message, form_unit_tag };
        const validator = vine.compile(flightsSchema);
        validator.errorReporter = () => new ErrorReporter();
        const output = await validator.validate(data);

        // Create a new flight document
        let result = new FlightModel({
            name: output.name,
            email: output.email,
            phone_number: output.phone_number,
            date: output.date,
            origin: output.origin,
            destination: output.destination,
            traveler: output.traveler,
            children: output.children,
            message: output.message,
            
        });

        await result.save(); 

        // Send email
        await SendEmail({ ...output, formType: 'flights' });

        return NextResponse.json({ success: true, message: `Dear ${output.name}, your query was sent successfully!` });
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({ status: 400, success: false, errors: error.messages });
        } else {
            return NextResponse.json({ status: 400, success: false, errors: { message: 'An error occurred. Please ensure all required fields are provided and valid.' } });
        }
    }
}
