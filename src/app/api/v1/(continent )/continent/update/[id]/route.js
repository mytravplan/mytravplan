import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import continentModel from "@/model/continentModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async() => {

        let { id } = params;

        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');

        // Check if all fields are empty
        if (!file && !title && !description && !slug) {
            return NextResponse.json({ status: 200, success: false, message: 'at least one more field is required' });
        }

        // Check if country exists
        let existingContinent = await continentModel.findById(id);
        if (!existingContinent) {
            return NextResponse.json({ status: 200, success: false, message: 'continent not found' });
        }

        // Update the fields if they are provided
        if (title) existingContinent.title = title;
        if (description) existingContinent.description = description;
        if (slug) existingContinent.slug = slug;

        // Upload new image if provided
        if (file) {
            const uploadedFile = await HandleFileUpload(file);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,

            };
            existingContinent.images = [imageObject];
        }

        // Save the updated document
        const result = await existingContinent.save();

        return NextResponse.json({ status: 200, success: true, message: 'continent updated successfully', result });
    })

}
