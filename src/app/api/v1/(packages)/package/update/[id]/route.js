import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackagesModel from "@/model/packagesModel";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";

DbConnect();

export async function PUT(req, { params }) {
 
    const { id } = params;
    const host = req.headers.get("host");

    // Parse incoming FormData
    const payload = await req.formData();
    const file = payload.get("file");
    const galleryFiles = payload.getAll("gallery_files");
    const title = payload.get("title");
    const description = payload.get("description");
    const slug = payload.get("slug");
    const package_price = payload.get("package_price");
    const package_discounted_price = payload.get("package_discounted_price");
    const package_days = payload.get("package_days");
    const package_nights = payload.get("package_nights");
    const package_hotel_name = payload.get("package_hotel_name");
    const packageOverview = payload.has("package_overview")
      ? payload.get("package_overview")
      : null;
    const packageTopSummary = payload.has("package_top_summary")
      ? payload.get("package_top_summary")
      : null;
    const packageItinerary = payload.has("package_itinerary")
      ? JSON.parse(payload.get("package_itinerary"))
      : null;
    const hotelActivities = payload.has("hotel_activities")
      ? JSON.parse(payload.get("hotel_activities"))
      : null;
    const packagesInclude = payload.has("packages_include")
      ? JSON.parse(payload.get("packages_include"))
      : null;
    const packagesExclude = payload.has("packages_exclude")
      ? JSON.parse(payload.get("packages_exclude"))
      : null;
    const sco_title = payload.get("sco_title");
    const sco_description = payload.get("sco_description");
    const sco_host_url = host;
    const package_categories_id = payload.has("package_categories_id")
      ? JSON.parse(payload.get("package_categories_id"))
      : null;
    const city_id = payload.has("city_id")
      ? JSON.parse(payload.get("city_id"))
      : null;
    const isShow = payload.get("isShow") ? true : false;

    // 1) Ensure the package actually exists
    const existingPackage = await PackagesModel.findById(id);
    if (!existingPackage) {
      return NextResponse.json({ success: false, message: "Package not found" });
    }

    // 2) Require both city_id and package_categories_id
    if (!Array.isArray(city_id) || city_id.length === 0) {
      return NextResponse.json({
        success: false,
        message: "city_id is required and must be a non-empty array.",
      });
    }
    if (
      !Array.isArray(package_categories_id) ||
      package_categories_id.length === 0
    ) {
      return NextResponse.json({
        success: false,
        message: "package_categories_id is required and must be a non-empty array.",
      });
    }


    if (slug && slug !== existingPackage.slug) {
      const existingSlug = await PackagesModel.findOne({ slug });
      if (existingSlug) {
        return NextResponse.json({
          success: false,
          message: "Slug already exists",
        });
      }
    }


    for (const singleCityId of city_id) {
      const cityExists = await CitiesModel.findById(singleCityId);
      if (!cityExists) {
        return NextResponse.json({
          success: false,
          message: `City ID ${singleCityId} does not exist. Provide valid city_id array.`,
        });
      }
    }


    if (title) existingPackage.title = title;
    if (description) existingPackage.description = description;
    if (slug) existingPackage.slug = slug;
    if (package_price) existingPackage.package_price = package_price;
    if (package_discounted_price)
      existingPackage.package_discounted_price = package_discounted_price;
    if (package_days) existingPackage.package_days = package_days;
    if (package_nights) existingPackage.package_nights = package_nights;
    if (packageOverview) existingPackage.package_overview = packageOverview;
    if (packageTopSummary)
      existingPackage.package_top_summary = packageTopSummary;
    if (packageItinerary) existingPackage.package_itinerary = packageItinerary;
    if (hotelActivities) existingPackage.hotel_activities = hotelActivities;
    if (packagesInclude) existingPackage.packages_include = packagesInclude;
    if (packagesExclude) existingPackage.packages_exclude = packagesExclude;
    if (sco_title) existingPackage.sco_title = sco_title;
    if (package_hotel_name)
      existingPackage.package_hotel_name = package_hotel_name;
    if (sco_description) existingPackage.sco_description = sco_description;

    existingPackage.sco_host_url = sco_host_url;


    existingPackage.package_categories_id = package_categories_id;
    existingPackage.city_id = city_id;


    if (payload.has("isShow")) {
      existingPackage.isShow = isShow;
    }

 
    if (file && file.size > 0) {
      const uploadedFile = await HandleFileUpload(file, host);
      existingPackage.images = [
        {
          name: uploadedFile.name,
          path: uploadedFile.path,
          contentType: uploadedFile.contentType,
        },
      ];
    }

 
    if (galleryFiles.length > 0 && galleryFiles[0]?.size > 0) {
      const galleryImages = [];
      for (const galleryFile of galleryFiles) {
        const uploadedGalleryFile = await HandleFileUpload(galleryFile, host);
        galleryImages.push({
          name: uploadedGalleryFile.name,
          path: uploadedGalleryFile.path,
          contentType: uploadedGalleryFile.contentType,
        });
      }
      existingPackage.packages_galleries = galleryImages;
    }

    
    const result = await existingPackage.save();
    return NextResponse.json({
      success: true,
      message: "Package updated successfully",
      result,
    });
 
}
