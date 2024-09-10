import { DbConnect } from "@/database/database";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    try {
        let { id } = params;
        let payload = await req.json();
        let { name, slug } = payload;

        if (!name || !slug) {
            return NextResponse.json({ status: 400, success: false, message: 'Name and slug are required' });
        }

        let isValidId = await CategoryModel.findById(id);
        if (!isValidId) {
            return NextResponse.json({ status: 404, success: false, message: 'Category not found with provided ID' });
        }

        let result = await CategoryModel.findByIdAndUpdate(id, { $set: { name, slug } }, { new: true });

        return NextResponse.json({ status: 200, success: true, message: 'Category updated successfully', result });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
    }
}
