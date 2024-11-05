import { DbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import countriesModel from "@/model/countryModel";
import continentModel from "@/model/continentModel";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

// Establish database connection
DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async () => {
        const host = req.headers.get('host');
        // Extract data from form data
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const sco_title = payload.get('sco_title');
        const sco_description = payload.get('sco_description');
        const continent_id = payload.get('continent_id');
        const isShow = payload.get('isShow') ? payload.get('isShow') === 'true' : false;

        // Check if at least one required field is present
        if (!file && !title && !description && !slug && !continent_id) {
            return NextResponse.json({
                status: 400,
                success: false,
                message: 'At least one of the fields (file, title, description, slug, continent_id) is required.'
            });
        }

        // Check if slug already exists
        const existingSlug = await countriesModel.findOne({ slug });
        if (existingSlug) {
            return NextResponse.json({
                status: 401,
                success: false,
                message: 'Slug already exists.'
            });
        }

        // Check if the continent ID is valid
        const existingContinent = await continentModel.findById(continent_id);
        if (!existingContinent) {
            return NextResponse.json({
                status: 404,
                success: false,
                message: 'Please provide a valid continent ID.'
            });
        }

        // Upload single image if a file is provided
        let imageObject = null;
        if (file) {
            const uploadedFile = await HandleFileUpload(file, host);
            imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
            };
        }

        const countryDocument = new countriesModel({
            images: imageObject ? [imageObject] : [],
            title: title || '',
            description: description || '',
            slug: slug || '',
            all_cities: [],
            all_packages: [],
            sco_title: sco_title || '',
            sco_description: sco_description || '',
            sco_host_url: host,
            continent_id: continent_id,
            isShow: isShow 
        });

        // Save the country document
        const result = await countryDocument.save();

        // Update the continent document to include the new country
        existingContinent.all_countries.push(result._id);
        await existingContinent.save();

        return NextResponse.json({ status: 201, success: true, result });
    });
}
