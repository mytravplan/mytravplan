import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import PackageCategoryModel from "@/model/packageCategories";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";

DbConnect();

export async function DELETE(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;
    
        // Check if the category ID is valid
        const category = await PackageCategoryModel.findById(id);
        if (!category) {
            return NextResponse.json({ status: 404, success: false, message: 'Category not found! Please provide a valid ID.' });
        }

        // Check if there are any packages associated with this category
        const associatedPackages = await PackagesModel.find({ package_categories_id: id }).exec();
        
        if (associatedPackages.length > 0) {
            return NextResponse.json({ status: 400, success: false, message: 'Category cannot be deleted because it has associated packages.' });
        }

        // Delete the category
        const result = await PackageCategoryModel.deleteOne({ _id: id });

      
        await PackagesModel.updateMany(
            { package_categories_id: id },
            { $pull: { package_categories_id: id } }
        );

        return NextResponse.json({ status: 200, success: true, message: 'Category deleted successfully', result });
    });
}
