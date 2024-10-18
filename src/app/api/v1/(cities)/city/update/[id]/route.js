import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import CitiesModel from "@/model/citiesModel";
import CountryModel from "@/model/countryModel"; // Ensure the correct model is imported
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params; // Get the city ID
        const host = req.headers.get('host'); // Get the host for the file path

        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const sco_title = payload.get('sco_title');
        const sco_description = payload.get('sco_description');
        const newCountryId = payload.get('country_id'); // New country ID for update

        // Find the existing city record
        let existingCity = await CitiesModel.findById(id);
        if (!existingCity) {
            return NextResponse.json({ status: 404, success: false, message: 'City not found' });
        }

        // Store the current country ID for removal later
        const currentCountryId = existingCity.country_id;

        // Update city fields if provided
        if (title) existingCity.title = title;
        if (description) existingCity.description = description;
        if (slug) existingCity.slug = slug;
        if (sco_title) existingCity.sco_title = sco_title;
        if (sco_description) existingCity.sco_description = sco_description;

        // Handle file upload if provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file, host);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            };
            existingCity.images = [imageObject];
        }

        // If a new country ID is provided and it's different from the current one
        if (newCountryId && newCountryId !== currentCountryId) {
            // Remove the city from the old country
            if (currentCountryId) {
                const oldCountry = await CountryModel.findById(currentCountryId);
                if (oldCountry) {
                    oldCountry.all_cities.pull(existingCity._id); // Remove city from the old country
                    await oldCountry.save(); // Save changes to the old country
                }
            }

            // Update the country reference in the city document
            existingCity.country_id = newCountryId;

            // Add the city to the new country
            const newCountry = await CountryModel.findById(newCountryId);
            if (newCountry) {
                newCountry.all_cities.push(existingCity._id); // Add city to the new country
                await newCountry.save(); // Save changes to the new country
            }
        }

        // Save the updated city document
        const result = await existingCity.save();

        return NextResponse.json({
            status: 201,
            success: true,
            message: 'City updated successfully',
            result,
        });
    });
}
