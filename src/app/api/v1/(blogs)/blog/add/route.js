import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import BlogModel from "@/model/blogModel";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    return handelAsyncErrors(async () => {
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const blog_category = payload.get('blog_category');
        const blog_overview = payload.get('blog_overview');
        const blog_description = JSON.parse(payload.get('blog_description')); 
        const galleryFiles = payload.getAll('gallery_files');

        // Check if the category exists
        const existCategory = await CategoryModel.findById(blog_category);
        if (!existCategory) {
            return NextResponse.json({ status: 400, message: 'missing credentials! please provide valid category id' });
        }

        // Check if slug already exists
        const existingSlug = await BlogModel.findOne({ slug });
        if (existingSlug) {
            return NextResponse.json({ status: 400, success: false, message: 'slug already exists' });
        }

        // Upload single image
        const uploadedFile = await HandleFileUpload(file);
        const imageObject = {
            name: uploadedFile.name,
            path: uploadedFile.path,
            contentType: uploadedFile.contentType
        };

        // Handle multiple gallery images
        const galleryImages = [];
        for (const galleryFile of galleryFiles) {
            const uploadedGalleryFile = await HandleFileUpload(galleryFile);
            galleryImages.push({
                name: uploadedGalleryFile.name,
                path: uploadedGalleryFile.path,
                contentType: uploadedGalleryFile.contentType
            });
        }

        // Create the new blog document
        const data = new BlogModel({
            images: [imageObject],
            title: title,
            description: description,
            slug: slug,
            blog_overview: blog_overview,
            blog_description: blog_description,
            blog_galleries: galleryImages,
            blog_category: blog_category
        });

        // Save the new blog document
        const result = await data.save();

        return NextResponse.json({ status: 201, success: true, message: 'Blog created successfully', result });
    });
}
