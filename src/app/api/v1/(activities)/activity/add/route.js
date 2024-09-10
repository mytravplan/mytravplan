import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
 
import CitiesModel from "@/model/citiesModel";
import ActivitiesModel from "@/model/activitiesModel";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async()=>{

    
    const host = req.headers.get('host');

    // Extract data from formdata
    const payload = await req.formData();
    const file = payload.get('file');
    const icon = payload.get('icon');
    const title = payload.get('title');
    const description = payload.get('description');
    const slug = payload.get('slug');
    const activity_price = payload.get('activity_price');
    const activity_discounted_price = payload.get('activity_discounted_price');
    const activity_overview = payload.get('activity_overview');
    const activity_top_summary = payload.get('activity_top_summary');
    const city_id = payload.get('city_id');

    // Check if slug already exists
    let existingSlug = await ActivitiesModel.findOne({ slug });
    if (existingSlug) {
        return NextResponse.json({ status: 404, success: false, message: 'Slug already exists' });
    }

    // Check if city ID exists
    let existingCity = await CitiesModel.findById(city_id);
    if (!existingCity) {
        return NextResponse.json({ status: 404, success: false, message: 'City ID does not exist! Please provide a valid city ID' });
    }

    // Upload single image
    const uploadedFile = await HandleFileUpload(file, host);
    const imageObject = {
        name: uploadedFile.name,
        path: uploadedFile.path,
        contentType: uploadedFile.contentType,
    };

    const uploadedIcon = await HandleFileUpload(icon, host);
    const iconObject = {
        name: uploadedIcon.name,
        path: uploadedIcon.path,
        contentType: uploadedIcon.contentType,
    };

    // Handle multiple gallery images
    const galleryFiles = payload.getAll('activity_galleries');
    const galleryImages = [];
    for (const galleryFile of galleryFiles) {
        const uploadedGalleryFile = await HandleFileUpload(galleryFile, host);
        galleryImages.push({
            name: uploadedGalleryFile.name,
            path: uploadedGalleryFile.path,
            contentType: uploadedGalleryFile.contentType,
        });
    }

    // Create the activity
    const response = new ActivitiesModel({
        images: [imageObject],
        icon:[iconObject],
        title,
        description,
        slug,
        activity_price,
        activity_discounted_price,
        activity_overview,
        activity_top_summary,
        activity_galleries: galleryImages,  
        city_id,
    });

    // Save the activity
    const result = await response.save();
    existingCity.all_activities.push(result._id);
    await existingCity.save();

    return NextResponse.json({ status: 201, success: true, result });
})
}
