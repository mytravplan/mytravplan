import { NextResponse } from 'next/server';
import { DbConnect } from '@/database/database';
import Transfer from '@/model/TransferModel';
import { uploadPhotoToCloudinary } from '@/utils/cloud';

export async function POST(request) {
  try {
    // 1) Connect to MongoDB
    await DbConnect();

    // 2) Parse multipart/form-data
    const formData = await request.formData();

    // 3) Get the “blob‐like” entries
    const transferImageFile = formData.get('transfer_image');
    const rawTitle = formData.get('transfer_title');
    const rawSlug = formData.get('transfer_slug');
    const transfer_price = formData.get('transfer_price');
    const rawOverviewDesc = formData.get('transfer_overview_description');
    const seo_title = formData.get('seo_title');
    const seo_description = formData.get('seo_description');
    const galleryFiles = formData.getAll('transfer_galleries');

    // 4) Validate required fields
    if (!rawTitle || typeof rawTitle !== 'string' || rawTitle.trim() === '') {
      return NextResponse.json(
        { status: 400, success: false, message: 'Missing required field: transfer_title.' },
        { status: 400 }
      );
    }
    if (!transferImageFile || typeof transferImageFile.arrayBuffer !== 'function') {
      return NextResponse.json(
        { status: 400, success: false, message: 'Missing or invalid transfer_image file.' },
        { status: 400 }
      );
    }
    const transferTitle = rawTitle.trim();

    // 5) Check slug collision (if provided)
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
          { status: 409 }
        );
      }
    }

    // 6) Upload the main image
    const mainImageUrl = await uploadPhotoToCloudinary(transferImageFile);

    // 7) Upload gallery images (if any)
    const galleryUrls = [];
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      for (const fileEntry of galleryFiles) {
        if (fileEntry && typeof fileEntry.arrayBuffer === 'function') {
          const url = await uploadPhotoToCloudinary(fileEntry);
          galleryUrls.push(url);
        }
      }
    }

    // 8) Build the document to insert
    const newTransferData = {
      transfer_title: transferTitle,
      transfer_image: mainImageUrl,
    };
    if (galleryUrls.length > 0) newTransferData.transfer_galleries = galleryUrls;
    if (finalSlug) newTransferData.transfer_slug = finalSlug;
    if (transfer_price) newTransferData.transfer_price = transfer_price;
    if (seo_title) newTransferData.seo_title = seo_title;
    if (seo_description) newTransferData.seo_description = seo_description;
    if (rawOverviewDesc && typeof rawOverviewDesc === 'string' && rawOverviewDesc.trim() !== '') {
      newTransferData.transfer_overview_description = rawOverviewDesc.trim();
    }

    // 9) Save in MongoDB
    const transfer = await Transfer.create(newTransferData);
    return NextResponse.json(
      { status: 201, success: true, message: 'Transfer created successfully', transfer },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/v1/transfer/create error:', error);
    return NextResponse.json(
      { status: 500, success: false, message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
