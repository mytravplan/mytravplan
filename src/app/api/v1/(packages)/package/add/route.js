 

import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackagesModel from "@/model/packagesModel";
import CitiesModel from "@/model/citiesModel";

 
DbConnect();

export async function POST(req) {
  const host = req.headers.get("host");
  const payload = await req.formData();
  const file = payload.get("file");
  const title = payload.get("title");
  const description = payload.get("description");
  const slug = payload.get("slug");
  const package_price = payload.get("package_price");
  const package_discounted_price = payload.get("package_discounted_price");
  const package_days = payload.get("package_days");
  const package_nights = payload.get("package_nights");
 
  const city_id = payload.getAll("city_id"); 
  const packageOverview = payload.get("package_overview");
  const packageTopSummary = payload.get("package_top_summary");
  const packageItinerary = JSON.parse(payload.get("package_itinerary"));
  const packagesInclude = JSON.parse(payload.get("packages_include"));
  const packagesExclude = JSON.parse(payload.get("packages_exclude"));
  const package_categories_id = JSON.parse(payload.get("package_categories_id"));
  const isShow = payload.get("isShow") ? payload.get("isShow") === "true" : false;
 
  const package_hotel_name = payload.get("package_hotel_name") || "";

 
  if (!title && !description && !slug && !package_price && city_id.length === 0) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message:
          "At least one of the following fields is required: title, description, slug, package_price, city_id.",
      },
      { status: 400 }
    );
  }

  let existingSlug = await PackagesModel.findOne({ slug });
  if (existingSlug) {
    return NextResponse.json({ status: 409, success: false, message: "Slug already exists" }, { status: 409 });
  }

 
  for (const cid of city_id) {
    const existingCity = await CitiesModel.findById(cid);
    if (!existingCity) {
      return NextResponse.json(
        { status: 404, success: false, message: `City ID ${cid} does not exist! Please provide a valid city ID` },
        { status: 404 }
      );
    }
  }

 
  let imageObject = null;
  if (file) {
    const uploadedFile = await HandleFileUpload(file, host);
    imageObject = {
      name: uploadedFile.name,
      path: uploadedFile.path,
      contentType: uploadedFile.contentType,
    };
  }

 
  const galleryFiles = payload.getAll("packages_galleries");
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

 
  const response = new PackagesModel({
    images: imageObject ? [imageObject] : [],
    title: title,
    description: description,
    slug: slug,
    package_price: package_price,
    package_discounted_price: package_discounted_price,
    package_days: package_days,
    package_nights: package_nights,
    package_overview: packageOverview,
    package_top_summary: packageTopSummary,
    package_itinerary: packageItinerary,
    packages_galleries: galleryImages,
    packages_include: packagesInclude,
    packages_exclude: packagesExclude,
    city_id: city_id,                         
    package_categories_id: package_categories_id,
    isShow: isShow,
    package_hotel_name: package_hotel_name,    
  });

 
  const result = await response.save();
  for (const cid of city_id) {
    const cityDoc = await CitiesModel.findById(cid);
    cityDoc.all_packages.push(result._id);
    await cityDoc.save();
  }

  return NextResponse.json({ status: 201, success: true, result }, { status: 201 });
}
