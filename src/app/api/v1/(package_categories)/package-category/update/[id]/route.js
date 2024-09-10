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
        const payload = await req.formData();
        const image = payload.get('image');
        const name = payload.get('name');
        const slug = payload.get('slug');

        // Check if category exists
        const existingCategory = await PackageCategoryModel.findById(id);
        if (!existingCategory) {
            return NextResponse.json({ status: 404, success: false, message: 'Category not found' });
        }

        // Update fields if they are provided
        if (name) existingCategory.name = name;
        if (slug) existingCategory.slug = slug;

        // Check if image is provided and handle it
        if (image && image.size > 0) {
            const uploadedFile = await HandleFileUpload(image);
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
