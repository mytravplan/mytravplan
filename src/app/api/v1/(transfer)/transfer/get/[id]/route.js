 

import { handelAsyncErrors } from "@/helpers/asyncErrors";
 
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Transfer from "@/model/TransferModel";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";



export async function GET(req, { params }) {
  await DbConnect()
  return handelAsyncErrors(async () => {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, message: "Invalid transfer ID." },
       
      );
    }

    const result = await Transfer.findById(id);
    if (!result) {
      return NextResponse.json(
        { status: 404, message: "Transfer not found." },
        
      );
    }

    return NextResponse.json({ status: 200, result });
  });
}

export async function DELETE(req, { params }) {
    await DbConnect()
  return handelAsyncErrors(async () => {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, message: "Invalid transfer ID." },
        
      );
    }

    const deleted = await Transfer.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { status: 404, message: "Transfer not found." },
     
      );
    }

    return NextResponse.json({ status: 200, message: "Transfer deleted." });
  });
}


export async function PUT(request, { params }) {

  try {
    await DbConnect()

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 400, success: false, message: 'Invalid transfer ID.' },
        
      )
    }

    const formData = await request.formData()
    const transferImageFile = formData.get('transfer_image')
    const galleryFiles = formData.getAll('transfer_galleries')

    const rawTitle = formData.get('transfer_title')
    const rawSlug = formData.get('transfer_slug')
    const transfer_price = formData.get('transfer_price')
    const rawOverviewDesc = formData.get('transfer_overview_description')

 
    const updateData = {}

   
    if (transferImageFile && transferImageFile instanceof File) {
      const savedMain = await HandleFileUpload(transferImageFile)
      updateData.transfer_image = savedMain.name
    }
 
    if (rawTitle !== null) {
      updateData.transfer_title = String(rawTitle).trim()
    }

 
    if (rawSlug !== null) {
      updateData.transfer_slug = String(rawSlug).trim()
    }

 
    if (transfer_price !== null) {
      updateData.transfer_price = Number(transfer_price)
    }

 
    if (rawOverviewDesc !== null) {
      updateData.transfer_overview_description = String(rawOverviewDesc).trim()
    }

 
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      const newGalleryNames = []
      for (const fileEntry of galleryFiles) {
        if (fileEntry instanceof File) {
          const saved = await HandleFileUpload(fileEntry)
          newGalleryNames.push(saved.name)
        }
      }
      updateData.transfer_galleries = newGalleryNames
    }

 
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { status: 400, success: false, message: 'No fields provided to update.' },
     
      )
    }

    const updated = await Transfer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return NextResponse.json(
        { status: 404, success: false, message: 'Transfer not found.' },
    
      )
    }

    return NextResponse.json(
      { status: 200, success: true, updated },
  
    )
  } catch (error) {
    console.error(`PUT /api/transfers/${params.id} error:`, error)
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { status: 422, success: false, message: error.message },
     
      )
    }
    return NextResponse.json(
      { status: 500, success: false, message: 'Internal server error.' },
    
    )
  }
}








