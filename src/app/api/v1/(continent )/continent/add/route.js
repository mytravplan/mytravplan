import { DbConnect } from "@/database/database";
import { NextResponse } from "next/server";

import continentModel from "@/model/continentModel";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
 
DbConnect();



export async function POST(req) {
    return handelAsyncErrors(async()=>{
        
             const host = req.headers.get('host');
             //extract data from formdata
             const payload = await req.formData();
             const file = payload.get('file');
             const title = payload.get('title');
             const description = payload.get('description');
             const slug = payload.get('slug');
     
             // check if slug is already exist
             let existingSlug=await continentModel.findOne({slug})
     
             if(existingSlug){
                 return NextResponse.json({status:200, success: false, message: 'slug is already exist' }); 
             }
            
             // upload single image
             const uploadedFile = await HandleFileUpload(file,host);
     
             const imageObject = {
                 name: uploadedFile.name,
                 path: uploadedFile.path,
                 contentType: uploadedFile.contentType,
                
             };
     
             const continentDocument = new continentModel({
                 images: [imageObject],
                 title: title,
                 description: description,
                 slug: slug,
                 all_countries:[]
             });
     
             // get total result of the continents
             const result = await continentDocument.save();
     
             return NextResponse.json({status:201, success: true, result });

    })

     
}
