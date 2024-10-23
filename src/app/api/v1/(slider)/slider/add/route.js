import { NextResponse } from "next/server";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import { DbConnect } from "@/database/database";
import SliderModel from "@/model/slider";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async () => {
    const host = req.headers.get('host');
    const payload = await req.formData();

 
    const galleryFiles = payload.getAll('galleries');
    const galleryImages = [];
    for (const galleryFile of galleryFiles) {
        if (galleryFile) {
            const uploadedGalleryFile = await HandleFileUpload(galleryFile, host);
            galleryImages.push({
                name: uploadedGalleryFile.name,
                path: uploadedGalleryFile.path,
                contentType: uploadedGalleryFile.contentType,
            });
        }
    }

    
    const result = new SliderModel({
        galleries: galleryImages,  
    });

    await result.save();

    
    return NextResponse.json({
        status: 201,
        success: true,
        result: result.galleries   
    });
    })
}
