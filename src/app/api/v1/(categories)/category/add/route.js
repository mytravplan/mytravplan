import { DbConnect } from "@/database/database";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
    try {
        let payload = await req.json();
        let { name, slug } = payload;

        if (!name || !slug) {
            return NextResponse.json({ status: 400, success: false, message: 'Name and slug are required' });
        }

        let isExistSlug = await CategoryModel.findOne({ slug });
        if (isExistSlug) {
            return NextResponse.json({ status: 409, success: false, message: 'Slug already exists' });
        }

        let result = new CategoryModel({ name, slug });
        await result.save();

        return NextResponse.json({ status: 201, success: true, message: 'Category created successfully', result });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
    }
}
