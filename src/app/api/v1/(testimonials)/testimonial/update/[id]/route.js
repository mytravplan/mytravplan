import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import TestimonialsModel from "@/model/testimonialsModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    try {
        const { id } = params; // Extract the ID from route parameters
        const host = req.headers.get('host'); // Get the host for file upload
        const payload = await req.formData(); // Get the form data from the request

        // Extract data from form data
        const file = payload.get('file');
        const name = payload.get('name');
        const description = payload.get('description');
        const designation = payload.get('designation');

        // Check if testimonial exists
        const testimonial = await TestimonialsModel.findById(id);
        if (!testimonial) {
            return NextResponse.json({ status: 404, success: false, message: 'Testimonial not found' });
        }

        // Update the fields if they are provided
        if (name) testimonial.name = name;
        if (description) testimonial.description = description;
        if (designation) testimonial.designation = designation;

        // Handle file upload if a file is provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file, host); // Pass host for URL construction
            testimonial.images.push({ // Assuming you're using images array in your schema
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            });
        }

        // Save the updated testimonial
        const result = await testimonial.save();
        return NextResponse.json({ status: 200, success: true, message: 'Testimonial updated successfully', result });
    } catch (error) {
        return NextResponse.json({ status: 500, success: false, message: 'bad request', });
    }
}
