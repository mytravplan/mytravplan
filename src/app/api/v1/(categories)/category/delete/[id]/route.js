import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import BlogModel from "@/model/blogModel";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect();

export async function DELETE(req, { params }) {
    return handelAsyncErrors(async()=>{

        let { id } = params;
    
        // Check if the category ID is valid
        let isValidId = await CategoryModel.findById(id);
        if (!isValidId) {
            return NextResponse.json({ status: 200, success: false, message: 'missing credentials! please provide a valid id' });
        }

        // Check if there are any blogs associated with this category
        const isCategory = await BlogModel.findById(id).populate({
            path: 'blog_category', 
        }).exec();

        if(isCategory){
            return NextResponse.json({ status: 200, success: false, message: 'category cannot be deleted because it has associated blogs'});
        }
    
        // Delete the category
        let result = await CategoryModel.deleteOne({ _id: id });
    
        // Remove the category from all blogs that reference it
        await BlogModel.updateMany(
            { blog_category: id },
            { $unset: { blog_category: "" } }
        );
    
        return NextResponse.json({ status: 200, success: true, message: 'category deleted successfully', result });
    })
    
     
}
