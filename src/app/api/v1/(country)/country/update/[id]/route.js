import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import continentModel from "@/model/continentModel";
import countryModel from "@/model/countryModel";
 
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;
        const host = req.headers.get('host');
        
        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const sco_title = payload.get('sco_title');
        const sco_description = payload.get('sco_description');
        const continentId = payload.get('continent_id');

        // Check if country exists
        let existingCountry = await countryModel.findById(id);
        if (!existingCountry) {
            return NextResponse.json({ success: false, message: 'Country not found' });
        }

        // Store the current continent ID for removal later
        const currentContinentId = existingCountry.continent_id;

        // Update the fields if they are provided
        if (title) existingCountry.title = title;
        if (description) existingCountry.description = description;
        if (slug) existingCountry.slug = slug;
        if (sco_title) existingCountry.sco_title = sco_title;
        if (sco_description) existingCountry.sco_description = sco_description;

        // Upload new image if provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file, host);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            };
            existingCountry.images = [imageObject];
        }

        // Update continent if provided
        if (continentId) {
            // Remove the country from the old continent
            if (currentContinentId) {
                const oldContinent = await continentModel.findById(currentContinentId);
                if (oldContinent) {
                    // Remove country ID from old continent
                    oldContinent.all_countries.pull(existingCountry._id); 
                    await oldContinent.save(); // Save the changes to old continent
                }
            }

            // Update the continent ID in the country document
            existingCountry.continent_id = continentId;

            // Add the country to the new continent
            const newContinent = await continentModel.findById(continentId);
            if (newContinent) {
                newContinent.all_countries.push(existingCountry._id); // Add country ID to new continent
                await newContinent.save(); // Save the changes to new continent
            }
        }

        // Save the updated document
        const result = await existingCountry.save();

        return NextResponse.json({ success: true, message: 'Country updated successfully', result });
    });
}
