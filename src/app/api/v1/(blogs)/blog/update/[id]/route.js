import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleFileUpload } from "@/helpers/uploadFiles";
import BlogModel from "@/model/blogModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
  return handelAsyncErrors(async () => {
    let { id } = params;

        // Extract data from formdata
        const payload = await req.formData();
        const file = payload.get('file');
        const title = payload.get('title');
        const description = payload.get('description');
        const slug = payload.get('slug');
        const blog_overview = payload.get('blog_overview');
        const blog_description = payload.has('blog_description') ? JSON.parse(payload.get('blog_description')) : null;
        const categoryId = payload.get('blog_category');

        // Check if all fields are empty
        if (!file && !title && !description && !slug && !categoryId && !blog_overview && !blog_description && !payload.getAll('blog_galleries').length) {
            return NextResponse.json({ status: 200, success: false, message: 'At least one field is required' });
        }

        // Check if blog exists
        let existingBlog = await BlogModel.findById(id);
        if (!existingBlog) {
            return NextResponse.json({ status: 404, success: false, message: 'Sorry! Blog not found' });
        }

        // Update the fields if they are provided
        if (title) existingBlog.title = title;
        if (description) existingBlog.description = description;
        if (slug) existingBlog.slug = slug;
        if (blog_overview) existingBlog.blog_overview = blog_overview;
        if (blog_description) existingBlog.blog_description = blog_description;
        if (categoryId) existingBlog.blog_category = categoryId;

    // Upload new main image if provided
    if (file) {
      const uploadedFile = await HandleFileUpload(file);
      existingBlog.file = {
        name: uploadedFile.name,
        path: uploadedFile.path,
        contentType: uploadedFile.contentType,
      };
    }

        // Handle multiple gallery images if provided
        const galleryFiles = payload.getAll('blog_galleries');
        if (galleryFiles.length > 0) {
            const galleryImages = [];
            for (const galleryFile of galleryFiles) {
                const uploadedGalleryFile = await HandleFileUpload(galleryFile);
                galleryImages.push({
                    name: uploadedGalleryFile.name,
                    path: uploadedGalleryFile.path,
                    contentType: uploadedGalleryFile.contentType,
                });
            }
            existingBlog.blog_galleries = galleryImages;
        }

    // Save the updated document
    const result = await existingBlog.save();
    return NextResponse.json({ status: 200, success: true, message: 'Blog updated successfully', result });
  });
}
