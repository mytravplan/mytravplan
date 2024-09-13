import { NextResponse } from "next/server";
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackageCategoryModel from "@/model/packageCategories";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function PUT(req, { params }) {
    try {
        const { id } = params;

        // Extract data from formData
        const host = req.headers.get('host');
        const payload = await req.formData();
        const image = payload.get('image');
        const name = payload.get('name');
        const slug = payload.get('slug');
        const sco_title = payload.get('sco_title')
        const sco_description = payload.get('sco_description')
        const sco_host_url = host

        // Check if category exists
        const existingCategory = await PackageCategoryModel.findById(id);
        if (!existingCategory) {
            return NextResponse.json({ status: 404, success: false, message: 'Category not found' });
        }

        // Update fields if they are provided
        if (name) existingCategory.name = name;
        if (slug) existingCategory.slug = slug;
        if (sco_title) existingCategory.sco_title = sco_title;
        if (sco_description) existingCategory.sco_description = sco_description;
        if (sco_host_url) existingCategory.sco_host_url = sco_host_url;

        // Check if image is provided and handle it
        if (image && image.size > 0) {
            const uploadedFile = await HandleFileUpload(image,host);
            const imageObject = {
                name: uploadedFile.name,
                path: uploadedFile.path,
                contentType: uploadedFile.contentType,
                
            };
            existingCategory.image = imageObject;
        }

        // Save the updated document
        const result = await existingCategory.save();

        return NextResponse.json({ status: 200, success: true, message: 'Category updated successfully', result });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
    }
}
