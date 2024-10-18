import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackagesModel from "@/model/packagesModel";
 
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";

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
        const packageOverview = payload.has('package_overview') ? payload.get('package_overview') : null;
        const packageTopSummary = payload.has('package_top_summary') ? payload.get('package_top_summary') : null;
        const packageItinerary = payload.has('package_itinerary') ? JSON.parse(payload.get('package_itinerary')) : null;
        const packagesInclude = payload.has('packages_include') ? JSON.parse(payload.get('packages_include')) : null;
        const packagesExclude = payload.has('packages_exclude') ? JSON.parse(payload.get('packages_exclude')) : null;
        const sco_title = payload.get('sco_title');
        const sco_description = payload.get('sco_description');
        const sco_host_url = host;
        const package_categories_id = payload.has('package_categories_id') ? JSON.parse(payload.get('package_categories_id')) : null;

        // Check if package exists
        let existingPackage = await PackagesModel.findById(id);
        if (!existingPackage) {
            return NextResponse.json({ success: false, message: 'Package not found' });
        }

        // Check if at least one field is provided
        if (!title && !description && !slug && !package_price && !city_id && !package_categories_id) {
            return NextResponse.json({
                success: false,
                message: 'At least one of the following fields is required: title, description, slug, package_price, city_id, package_categories_id.'
            });
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
        if (sco_title) existingPackage.sco_title = sco_title;
        if (sco_description) existingPackage.sco_description = sco_description;
        if (sco_host_url) existingPackage.sco_host_url = sco_host_url;

        // Handle city update logic
        if (city_id) {
            // Remove the package ID from the old city's package list if it exists
            if (existingPackage.city_id) {
                const oldCity = await CitiesModel.findById(existingPackage.city_id);
                if (oldCity) {
                    oldCity.all_packages = oldCity.all_packages.filter(pkgId => pkgId.toString() !== existingPackage._id.toString());
                    await oldCity.save();
                }
            }
            // Update the package with the new city ID
            existingPackage.city_id = city_id;
            // Add the package ID to the new city's package list
            const newCity = await CitiesModel.findById(city_id);
            if (newCity) {
                newCity.all_packages.push(existingPackage._id);
                await newCity.save();
            }
        }

        // Update package categories ID if provided
        if (package_categories_id) {
            existingPackage.package_categories_id = package_categories_id;
        }

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
