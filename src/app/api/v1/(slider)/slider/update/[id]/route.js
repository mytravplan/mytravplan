import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import SliderModel from "@/model/slider";
import { NextResponse } from "next/server";

DbConnect()

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        let { id } = params;
        const host = req.headers.get('host');

      
        const payload = await req.formData();
   
        const galleryFiles = payload.getAll('galleries');

        let existingSlider=await SliderModel.findOne({_id:id})

        if(!existingSlider){
            console.log('please provide valid  id')
        }
        

      
         
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
            existingSlider.galleries = galleryImages;
        }

        // Save the updated document
        const result = await existingSlider.save();

        return NextResponse.json({ success: true, message: 'slider updated successfully', result });
    });
}
