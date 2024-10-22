import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import TestimonialsModel from "@/model/testimonialsModel";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        const host = req.headers.get('host');
        const payload = await req.formData();
        const file = payload.get('file');
        const name = payload.get('name');
        const description = payload.get('description');
        const designation = payload.get('designation');

        // Validate that at least one field is provided
        if (!file && !name && !description && !designation) {
            return NextResponse.json({ status: 400, message: 'At least one field is required' });
        }

        let uploadedFile = null;

        // Handle file upload if a file is provided
        if (file) {
            uploadedFile = await HandleFileUpload(file, host);
        }

        // Prepare image object if file was uploaded
        const imageObject = uploadedFile ? {
            name: uploadedFile.name,
            path: uploadedFile.path,
            contentType: uploadedFile.contentType,
        } : null; // Set to null if no file was uploaded

        // Construct testimonial data
        const testimonialData = {
            images: imageObject ? [imageObject] : [],  // Add image only if file was uploaded
            name: name || '',                          // Set field or empty string
            description: description || '',
            designation: designation || '',
        };

        // Save the testimonial
        const response = new TestimonialsModel(testimonialData);
        const result = await response.save();

       

        return NextResponse.json({ status: 201, success: true, result });
    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Server error', error: error.message });
    }
}
