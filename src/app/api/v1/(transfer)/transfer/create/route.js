import { NextResponse } from 'next/server';
import { DbConnect } from '@/database/database';
import Transfer from '@/model/TransferModel';
import { uploadPhotoToCloudinary } from '@/utils/cloud';
 

export async function POST(request) {

    await DbConnect();
    const formData = await request.formData();
    const transferImageFile = formData.get('transfer_image');
    const rawTitle = formData.get('transfer_title');
    const rawSlug = formData.get('transfer_slug');
    const transfer_price = formData.get('transfer_price');
    const rawOverviewDesc = formData.get('transfer_overview_description');
    const seo_title = formData.get('seo_title');
    const seo_description = formData.get('seo_description');
    const galleryFiles = formData.getAll('transfer_galleries');
    if (!rawTitle || typeof rawTitle !== 'string' || rawTitle.trim() === '') {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: 'Missing required field: transfer_title.',
        },
      );
    }
    const transferTitle = rawTitle.trim();
    let finalSlug = '';
    if (rawSlug && typeof rawSlug === 'string' && rawSlug.trim() !== '') {
      finalSlug = rawSlug.trim();
      const existingTransfer = await Transfer.findOne({ transfer_slug: finalSlug });
      if (existingTransfer) {
        return NextResponse.json(
          {
            status: 409,
            success: false,
            message: `Slug "${finalSlug}" is already in use. Please choose a different slug.`,
          },
        );
      }
    }

    const mainImageUrl = await uploadPhotoToCloudinary(transferImageFile)

    const galleryUrls = [];
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      for (const fileEntry of galleryFiles) {
        if (fileEntry instanceof File) {
          const url = await uploadPhotoToCloudinary(fileEntry);
          galleryUrls.push(url);
        }
      }
    }

 
    const newTransferData = {
      transfer_title: transferTitle,
      transfer_image: mainImageUrl,
    };

    if (galleryUrls.length > 0) {
      newTransferData.transfer_galleries = galleryUrls;
    }

    if (finalSlug) {
      newTransferData.transfer_slug = finalSlug;
    }

    if (transfer_price) {
      newTransferData.transfer_price = transfer_price;
    }

    if (seo_title) {
      newTransferData.seo_title = seo_title;
    }

    if (seo_description) {
      newTransferData.seo_description = seo_description;
    }

    if (typeof rawOverviewDesc === 'string' && rawOverviewDesc.trim() !== '') {
      newTransferData.transfer_overview_description = rawOverviewDesc.trim();
    }

     
    const transfer = await Transfer.create(newTransferData);
    return NextResponse.json(
      { message: 'Transfer created successfully', status: 201, transfer },
    );
   
}