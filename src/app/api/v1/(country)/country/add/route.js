import { DbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import countriesModel from "@/model/countryModel";
import continentModel from "@/model/continentModel";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async()=>{
        
        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const continent_id = payload.get('continent_id');  

        // Check if slug is already exist
        let existingSlug = await countriesModel.findOne({ slug });

        if (existingSlug) {
            return NextResponse.json({status:401, success: false, message: 'slug is already exist' });
        }

        // Check if the continent ID is valid
        let existingContinent = await continentModel.findById(continent_id);

        if (!existingContinent) {
            return NextResponse.json({status:404, success: false, message: 'please provide valid continent id' });
        }

        // Upload single image
        const uploadedFile = await HandleFileUpload(file);

        const imageObject = {
            name: uploadedFile.name,
            path: uploadedFile.path,
            contentType: uploadedFile.contentType,
             
        };

        const countryDocument = new countriesModel({
            images: [imageObject],
            title: title,
            description: description,
            slug: slug,
            all_cities: [],
            all_packages: [],
            continent_id: continent_id,
        });

        // Save the country document
        const result = await countryDocument.save();

        // Update the continent document to include the new country
        existingContinent.all_countries.push(result._id);
        await existingContinent.save();

        return NextResponse.json({status:201, success: true, result });
    })
    
      

     
}
