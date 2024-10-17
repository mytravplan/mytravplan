import { DbConnect } from "@/database/database";
import TestimonialsModel from "@/model/testimonialsModel";
import { NextResponse } from "next/server";

 

DbConnect();

export async function DELETE(req, { params }) {
    const { id } = params; // Capture the ID from the route parameters

    try {
        // Delete the testimonial by ID from the database
        const deletedTestimonial = await TestimonialsModel.findByIdAndDelete(id);

        // Check if testimonial was found and deleted
        if (!deletedTestimonial) {
            return NextResponse.json({ status: 404, success: false, message: 'Testimonial not found' });
        }

        
        return NextResponse.json({ status: 200, success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      
        return NextResponse.json({ status: 500, success: false, message: 'testimonial not found please provide valid credentials' });
    }
}
