import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import countryModel from "@/model/countryModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {

        let { id } = params;
        let host=req.headers.get('host')
        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const sco_title = payload.get('sco_title')
        const sco_description = payload.get('sco_description')
        const sco_host_url = host
        const continentId = payload.get('continent_id');

        
    

        // Check if country exists
        let existingCountry = await countryModel.findById(id);
        if (!existingCountry) {
            return NextResponse.json({ success: false, message: 'Country not found' });
        }

        // Update the fields if they are provided
        if (title) existingCountry.title = title;
        if (description) existingCountry.description = description;
        if (slug) existingCountry.slug = slug;
        if (sco_title) existingCountry.sco_title = sco_title;
        if (sco_description) existingCountry.sco_description = sco_description;
        if (sco_host_url) existingCountry.sco_host_url = sco_host_url;

        // Upload new image if provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file,host);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
               
            };
            existingCountry.images = [imageObject];
        }
        if (continentId) {
            existingCountry.continent_id = continentId
        }

        // Save the updated document
        const result = await existingCountry.save();

        return NextResponse.json({ success: true, message: 'Country updated successfully', result });
    })

}
