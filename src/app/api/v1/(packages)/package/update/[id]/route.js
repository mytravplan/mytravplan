import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackagesModel from "@/model/packagesModel";
import CitiesModel from "@/model/citiesModel";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        let { id } = params;
        const host = req.headers.get('host');

        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const galleryFiles = payload.getAll('gallery_files');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const package_price = payload.get('package_price');
        const package_discounted_price = payload.get('package_discounted_price');
        const package_days = payload.get('package_days');
        const package_nights = payload.get('package_nights');
        const city_id = payload.get('city_id');
        const packageOverview = payload.get('package_overview');
        const packageTopSummary = payload.get('package_top_summary');
        const packageItinerary = payload.has('package_itinerary') ? JSON.parse(payload.get('package_itinerary')) : null;
        const packagesInclude = payload.has('packages_include') ? JSON.parse(payload.get('packages_include')) : null;
        const packagesExclude = payload.has('packages_exclude') ? JSON.parse(payload.get('packages_exclude')) : null;
        const package_categories_id = payload.has('package_categories_id') ? JSON.parse(payload.get('package_categories_id')) : null;

        // Check if package exists
        let existingPackage = await PackagesModel.findById(id);
        if (!existingPackage) {
            return NextResponse.json({ success: false, message: 'Package not found' });
        }

        // Check if new slug already exists
        if (slug && slug !== existingPackage.slug) {
            let existingSlug = await PackagesModel.findOne({ slug });
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
        if (title) existingPackage.title = title;
        if (description) existingPackage.description = description;
        if (slug) existingPackage.slug = slug;
        if (package_price) existingPackage.package_price = package_price;
        if (package_discounted_price) existingPackage.package_discounted_price = package_discounted_price;
        if (package_days) existingPackage.package_days = package_days;
        if (package_nights) existingPackage.package_nights = package_nights;
        if (packageOverview) existingPackage.package_overview = packageOverview;
        if (packageTopSummary) existingPackage.package_top_summary = packageTopSummary;
        if (packageItinerary) existingPackage.package_itinerary = packageItinerary;
        if (packagesInclude) existingPackage.packages_include = packagesInclude;
        if (packagesExclude) existingPackage.packages_exclude = packagesExclude;
        if (city_id) existingPackage.city_id = city_id;
        if (package_categories_id) existingPackage.package_categories_id = package_categories_id;

        // Upload new image if provided
        if (file && file.size > 0) {
            const uploadedFile = await HandleFileUpload(file, host);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            };
            existingPackage.images = [imageObject];
        }

        // Handle multiple gallery images if provided
        if (galleryFiles.length > 0 && galleryFiles[0].size > 0) {
            const galleryImages = [];
            for (const galleryFile of galleryFiles) {
                const uploadedGalleryFile = await HandleFileUpload(galleryFile, host);
                galleryImages.push({
                    name: uploadedGalleryFile.name,
                    path: uploadedGalleryFile.path,
                    contentType: uploadedGalleryFile.contentType,
                });
            }
            existingPackage.packages_galleries = galleryImages;
        }

        // Save the updated document
        const result = await existingPackage.save();

        return NextResponse.json({ success: true, message: 'Package updated successfully', result });
    });
}
