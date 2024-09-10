import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import BlogModel from "@/model/blogModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req, { params }) {
  return handelAsyncErrors(async () => {
    let { id } = params;

    // Validate the ID and find the blog
    let blog = await BlogModel.findById(id).populate('blog_category').exec();

        if (!blog) {
            return NextResponse.json({ status: 200, success: false, message: 'missing credentials! please provide a valid ID.' });
        }
        let result = {
            _id: blog._id,
            images: blog.images,
            title: blog.title,
            description: blog.description,
            slug: blog.slug,
            blog_overview: blog.blog_overview,
            blog_description: blog.blog_description,
            blog_galleries: blog.blog_galleries,
            category: blog.blog_category ? {
                _id: blog.blog_category._id,
                name: blog.blog_category.name,
                slug: blog.blog_category.slug
            } : null,
            createdAt: blog.createdAt
        };
        return NextResponse.json({ status: 200, success: true, result });
    });
}
