import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import BlogModel from "@/model/blogModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req) {
    return handelAsyncErrors(async () => {
        // Get pagination parameters
        let { page, limit, skip } = getPaginationParams(req);

        // Fetch blogs with pagination and populate categories
        let blogs = await BlogModel.find()
            .populate('blog_category')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();

        // Get the total number of blog documents
        let totalResults = await BlogModel.countDocuments();

        // Format the results
        let result = blogs.map(blog => ({
            _id: blog._id,
            images: blog.images,
            title: blog.title,
            description: blog.description,
            slug: blog.slug,
            category: blog.blog_category ? {
                _id: blog.blog_category._id,
                name: blog.blog_category.name,
                slug: blog.blog_category.slug
            } : null,
            blog_overview: blog.blog_overview,
            blog_description: blog.blog_description,
            createdAt: blog.createdAt
        }));

        // Return the response
        return NextResponse.json({ status: 200, success: true, totalResults, result, page, limit });
    });
}
