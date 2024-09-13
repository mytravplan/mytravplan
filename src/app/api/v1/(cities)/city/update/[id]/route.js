import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import CitiesModel from "@/model/citiesModel";

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
        const countryId = payload.get('country_id');

        // Check if all fields are empty
       
        // Check if country exists
        let existingCountry = await CitiesModel.findById(id);
        if (!existingCountry) {
            return NextResponse.json({status:404, success: false, message: 'sorry! country not found' });
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
        if(countryId){
            existingCountry.country_id=countryId
        }
        // Save the updated document
        const result = await existingCountry.save();
        return NextResponse.json({status:201, success: true, message:'city updated successfully',result });
    })


}
