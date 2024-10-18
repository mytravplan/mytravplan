import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import CitiesModel from "@/model/citiesModel";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import countriesModel from "@/model/countryModel";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function POST(req) {
  return handelAsyncErrors(async () => {
    const host = req.headers.get('host');
    // Extract data from form data
    const payload = await req.formData();
    const file = payload.get('file');
    const title = payload.get('title');
    const description = payload.get('description');
    const slug = payload.get('slug');
    const sco_title = payload.get('sco_title');
    const sco_description = payload.get('sco_description');
    const sco_host_url = host;
    const country_id = payload.get('country_id');

    // Check if at least one field is provided
    if (!title && !description && !slug && !file) {
      return NextResponse.json({ success: false, message: 'At least one field (title, description, slug, or file) is required.' });
    }

    // Check if slug already exists
    if (slug) {
      let existingSlug = await CitiesModel.findOne({ slug });
      if (existingSlug) {
        return NextResponse.json({ success: false, message: 'Slug already exists.' });
      }
    }

    // Check if country ID exists
    let existingCountry = await countriesModel.findById(country_id);
    if (!existingCountry) {
      return NextResponse.json({ success: false, message: 'Missing credentials: country_id is required.' });
    }

    // Upload single image if provided
    let imageObject = null;
    if (file) {
      const uploadedFile = await HandleFileUpload(file, host);
      imageObject = {
        name: uploadedFile.name,
        path: uploadedFile.path,
        contentType: uploadedFile.contentType,
      };
    }

    // Create the new city document
    const newCity = new CitiesModel({
      images: imageObject ? [imageObject] : [],
      title: title || null,
      description: description || null,
      slug: slug || null,
      all_packages: [],
      sco_title: sco_title || null,
      sco_description: sco_description || null,
      sco_host_url: sco_host_url,
      country_id: country_id,
    });

    // Save the new city document
    const result = await newCity.save();

    // Add the new city's ID to the country's all_cities array
    existingCountry.all_cities.push(result._id);
    await existingCountry.save();

    return NextResponse.json({ status: 201, success: true, result });
  });
}
