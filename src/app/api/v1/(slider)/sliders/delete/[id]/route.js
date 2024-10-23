// app/api/v1/slider/delete/[id]/route.js
import { DbConnect } from '@/database/database';
import SliderModel from '@/model/slider';
import { NextResponse } from 'next/server';
 
DbConnect()
export async function DELETE(req, { params }) {
  const { id } = params; // Get the image ID from the URL parameters

 

  try {
    // Find the slider that contains the image to be deleted
    const slider = await SliderModel.findOne({ "galleries._id": id });

    if (!slider) {
      return NextResponse.json({ success: false, message: 'Image not found.' }, { status: 404 });
    }

    // Remove the image from the galleries
    slider.galleries = slider.galleries.filter(image => image._id.toString() !== id);

     
    await slider.save();

    return NextResponse.json({ success: true, message: 'Image deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting image.', error: error.message }, { status: 500 });
  }
}
