import { DbConnect } from "@/database/database";
import Transfer from "@/model/TransferModel";
import { uploadPhotoToCloudinary } from "@/utils/cloud";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
 

export async function PUT(request, { params }) {
  try {
    await DbConnect();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, success: false, message: "Invalid transfer ID." },
       
      );
    }

    const formData = await request.formData();
    const transferImageFile = formData.get("transfer_image");
    const galleryFiles = formData.getAll("transfer_galleries");
    const deleteMainImage = formData.get("delete_main_image") === "true";
    const existingGalleries = formData.getAll("existing_galleries");

    // Find existing transfer
    const existingTransfer = await Transfer.findById(id);
    if (!existingTransfer) {
      return NextResponse.json(
        { status: 404, success: false, message: "Transfer not found." },
    
      );
    }

 
    const updateData = {
      transfer_title: formData.get("transfer_title") || existingTransfer.transfer_title,
      transfer_slug: existingTransfer.transfer_slug,
      transfer_price: formData.get("transfer_price") || existingTransfer.transfer_price,
      transfer_overview_description: formData.get("transfer_overview_description") || existingTransfer.transfer_overview_description,
      seo_title: formData.get("seo_title") || existingTransfer.seo_title,
      seo_description: formData.get("seo_description") || existingTransfer.seo_description,
    };

 
    if (deleteMainImage) {
      updateData.transfer_image = null;
    } else if (transferImageFile && transferImageFile instanceof File) {
      const mainImageUrl = await uploadPhotoToCloudinary(transferImageFile);
      updateData.transfer_image = mainImageUrl;
    }

 
    const newGalleryUrls = [];
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      for (const fileEntry of galleryFiles) {
        if (fileEntry instanceof File) {
          const url = await uploadPhotoToCloudinary(fileEntry);
          newGalleryUrls.push(url);
        }
      }
    }

 
    updateData.transfer_galleries = [
      ...existingGalleries,
      ...newGalleryUrls,
    ];

 
    const updatedTransfer = await Transfer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Transfer updated successfully",
        transfer: updatedTransfer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /api/transfers/${params.id} error:`, error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { status: 422, success: false, message: error.message },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { status: 500, success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}