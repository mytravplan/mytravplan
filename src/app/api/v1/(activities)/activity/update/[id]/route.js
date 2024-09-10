import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import ActivitiesModel from "@/model/activitiesModel";
import CitiesModel from "@/model/citiesModel";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        let { id } = params;
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

        // Check if activity exists
        let existingActivity = await ActivitiesModel.findById(id);
        if (!existingActivity) {
            return NextResponse.json({ success: false, message: 'Activity not found' });
        }

        // Check if new slug already exists
        if (slug && slug !== existingActivity.slug) {
            let existingSlug = await ActivitiesModel.findOne({ slug });
            if (existingSlug) {
                return NextResponse.json({ success: false, message: 'Slug already exists' });
            }
        }

        // Check if city ID exists
        if (city_id) {
            let existingCity = await CitiesModel.findById(city_id);
            if (!existingCity) {
                return NextResponse.json({ success: false, message: 'City ID does not exist! Please provide a valid city ID' });
            }
        }

        // Update the fields if they are provided
        if (title) existingActivity.title = title;
        if (description) existingActivity.description = description;
        if (slug) existingActivity.slug = slug;
        if (activity_price) existingActivity.activity_price = activity_price;
        if (activity_discounted_price) existingActivity.activity_discounted_price = activity_discounted_price;
        if (activity_overview) existingActivity.activity_overview = activity_overview;
        if (activity_top_summary) existingActivity.activity_top_summary = activity_top_summary;
        if (city_id) existingActivity.city_id = city_id;

        // Upload new image if provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file, host);
          
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            };
            existingActivity.images = [imageObject];
        }

        if (icon) {
            const uploadedIcon = await HandleFileUpload(icon, host);
          
            const iconObject = {
                name: uploadedIcon.name,
                path: uploadedIcon.path,
                contentType: uploadedIcon.contentType,
            };
            existingActivity.icon = [iconObject];
        }

        // Handle multiple gallery images if provided
        const galleryFiles = payload.getAll('activity_galleries');
        if (galleryFiles.length > 0) {
            const galleryImages = [];
            for (const galleryFile of galleryFiles) {
                const uploadedGalleryFile = await HandleFileUpload(galleryFile, host);
            
                galleryImages.push({
                    name: uploadedGalleryFile.name,
                    path: uploadedGalleryFile.path,
                    contentType: uploadedGalleryFile.contentType,
                });
            }
            existingActivity.activity_galleries = galleryImages;
        }

        // Save the updated document
        const result = await existingActivity.save();

        

        return NextResponse.json({ success: true, message: 'Activity updated successfully', result });
    });
}
