import { DbConnect } from "@/database/database";
 
import { getPaginationParams } from "@/helpers/paginations";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await DbConnect();

        // Extract pagination parameters
        let { page, limit, skip } = getPaginationParams(req);

        // Fetch packages with pagination and population
        let data = await PackagesModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate({
                path: 'city_id',
                populate: {
                    path: 'country_id',
                    populate: {
                        path: 'continent_id',
                    }
                }
            })
            .exec();

        // Format the result
        let result = data.map(e => ({
            _id: e._id,
            images: e.images,
            title: e.title,
            description: e.description,
            slug: e.slug,
            package_price: e.package_price,
            package_discounted_price: e.package_discounted_price,
            package_days: e.package_days,
            package_nights: e.package_nights,
            package_under_continent: e.city_id?.country_id?.continent_id ? {
                _id: e.city_id.country_id.continent_id._id.toString(),
                title: e.city_id.country_id.continent_id.title,
                slug: e.city_id.country_id.continent_id.slug
            } : null,
            package_under_country: e.city_id?.country_id ? {
                _id: e.city_id.country_id._id.toString(),
                title: e.city_id.country_id.title,
                slug: e.city_id.country_id.slug
            } : null,
            package_under_city: e.city_id ? {
                _id: e.city_id._id.toString(),
                title: e.city_id.title,
                slug: e.city_id.slug
            } : null
        }));

        // Count total number of documents
        let totalResults = await PackagesModel.countDocuments();

        return NextResponse.json({ status: 200, success: true, totalResults, result, page, limit });
    } catch (error) {
        console.error("Error fetching packages:", error);
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Internal server error.",
        });
    }
}
