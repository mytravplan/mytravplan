
import { DbConnect } from "@/database/database";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import PackageCategoryModel from "@/model/packageCategories";
import { NextResponse } from "next/server";

DbConnect()

export async function POST(req) {
    try {
        const host = req.headers.get('host');
        let payload = await req.formData();
        let image = payload.get('image')
        let name = payload.get('name')
        let slug = payload.get('slug')
        const sco_title = payload.get('sco_title')
        const sco_description = payload.get('sco_description')
        const sco_host_url = host


        if (!name || !slug) {
            return NextResponse.json({ status: 400, success: false, message: 'Name and slug are required' });
        }

        let isExistSlug = await PackageCategoryModel.findOne({ slug });
        if (isExistSlug) {
            return NextResponse.json({ status: 409, success: false, message: 'Slug already exists' });
        }

        const uploadedFile = await HandleFileUpload(image, host);

        const imageObject = {
            name: uploadedFile.name,
            path: uploadedFile.path,
            contentType: uploadedFile.contentType,

        };

        let result = new PackageCategoryModel({
            image: [imageObject],
            name: name,
            slug: slug,
            sco_title: sco_title,
            sco_description: sco_description,
            sco_host_url: sco_host_url,
        });
        await result.save();

        return NextResponse.json({ status: 201, success: true, message: 'Category created successfully', result });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
    }
}
