 
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackageCategoryModel from "@/model/packageCategories";
import { NextResponse } from "next/server";

DbConnect() 

export async function POST(req) {
    try {
        let payload = await req.formData();
        let image = payload.get('image')
        let name = payload.get('name')
        let slug = payload.get('slug')


        if (!name || !slug) {
            return NextResponse.json({ status: 400, success: false, message: 'Name and slug are required' });
        }

        let isExistSlug = await PackageCategoryModel.findOne({ slug });
        if (isExistSlug) {
            return NextResponse.json({ status: 409, success: false, message: 'Slug already exists' });
        }

        const uploadedFile = await HandleFileUpload(image);

        const imageObject = {
            name: uploadedFile.name,
            path: uploadedFile.path,
            contentType: uploadedFile.contentType,
        };

        let result = new PackageCategoryModel({
            image: [imageObject], name: name, slug: slug
        });
        await result.save();

        return NextResponse.json({ status: 201, success: true, message: 'Category created successfully', result });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
    }
}
