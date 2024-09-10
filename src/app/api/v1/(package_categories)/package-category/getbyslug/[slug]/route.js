// /app/api/v1/(package_categories)/package-category/getbyslug/[slug]/route.jsx

import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import PackageCategoryModel from "@/model/packageCategories";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";

// Connect to the database
DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async () => {
        const { slug } = params;

        // Find the category by slug
        const category = await PackageCategoryModel.findOne({ slug });

        if (!category) {
            return NextResponse.json({
                status: 404,
                success: false,
                message: 'Category not found! Please provide a valid slug.'
            });
        }

        // Find the packages associated with this category, select only the required fields
        const packages = await PackagesModel.find({ package_categories_id: category._id })
            .select('images title description package_price package_discounted_price package_days package_nights') // Only select the needed fields
            .lean() // Convert to plain JavaScript objects
            .exec();

        // Format packages for the response
        const formattedPackages = packages.map(pkg => ({
            id: pkg._id.toString(), // Convert ObjectId to string if necessary
            images: pkg.images,
            title: pkg.title,
            description: pkg.description,
            package_price: pkg.package_price,
            package_discounted_price:pkg.package_discounted_price,
            package_days: pkg.package_days,
            package_nights: pkg.package_nights,

        }));

        return NextResponse.json({
            status: 200,
            success: true,
            result: [
                {
                    category: {
                        id: category._id.toString(),
                        name: category.name,
                        slug: category.slug,
                        image: category.image
                    },
                    packages: formattedPackages
                }
            ]
        });
    });
}
