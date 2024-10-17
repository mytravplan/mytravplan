import { DbConnect } from "@/database/database";
import TestimonialsModel from "@/model/testimonialsModel";
import { NextResponse } from "next/server";

 

DbConnect();

export async function GET(req, { params }) {
    const { id } = params; // Capture the ID from the route parameters

    try {
        // Fetch the testimonial by ID from the database
        const result = await TestimonialsModel.findById(id);

        // Check if testimonial exists
        if (!result) {
            return NextResponse.json({ status: 404, success: false, message: 'Testimonial not found' });
        }

        // Return the testimonial in the response
        return NextResponse.json({ status: 200, success: true, result });
    } catch (error) {
        // Handle errors (e.g., invalid ID format)
        return NextResponse.json({ status: 500, success: false, message: 'testimonial not found please provide valid credentials'});
    }
}
