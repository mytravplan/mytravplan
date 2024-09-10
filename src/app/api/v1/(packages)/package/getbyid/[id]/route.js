import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";

// Connect to the database
DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ status: 400, success: false, message: 'Package ID is required' });
        }

         

        try {
   
            const result = await PackagesModel.findById(id)
                .populate({
                    path: 'city_id',
                    populate: {
                        path: 'country_id',
                        populate: {
                            path: 'continent_id',
                        }
                    }
                })
                .populate({
                    path: 'package_categories_id',
                    model: 'packages_categories',  
                    select: '_id name slug'  
                })
                .lean(); // Convert to plain JavaScript objects

           

            if (!result) {
                return NextResponse.json({ status: 404, success: false, message: 'Package not found' });
            }

           
            const formattedResult = {
                _id: result._id,
                title: result.title,
                images: result.images,
                description: result.description,
                slug: result.slug,
                package_price: result.package_price,
                package_discounted_price: result.package_discounted_price,
                package_days: result.package_days,
                package_nights: result.package_nights,
                packageOverview: result.package_overview,
                packageTopSummary: result.package_top_summary,
                packageItinerary: result.package_itinerary,
                packages_galleries: result.packages_galleries,
                packagesInclude: result.packages_include,
                packagesExclude: result.packages_exclude,
                city_id:result.city_id,
                package_under_continent: result.city_id?.country_id?.continent_id ? {
                    _id: result.city_id.country_id.continent_id._id.toString(),
                    title: result.city_id.country_id.continent_id.title,
                    slug: result.city_id.country_id.continent_id.slug
                } : null,
                package_under_country: result.city_id?.country_id ? {
                    _id: result.city_id.country_id._id.toString(),
                    title: result.city_id.country_id.title,
                    slug: result.city_id.country_id.slug
                } : null,
                package_under_city: result.city_id ? {
                    _id: result.city_id._id.toString(),
                    title: result.city_id.title,
                    slug: result.city_id.slug
                } : null,
                package_under_categories: result.package_categories_id?.map(category => ({
                    _id: category._id.toString(),
                    name: category.name,
                    slug: category.slug
                })) || null
            };

            return NextResponse.json({ status: 200, success: true, result: [formattedResult] });
        } catch (error) {
            console.error('Error fetching package by ID:', error);
            return NextResponse.json({ status: 500, success: false, message: 'Internal Server Error' });
        }
    });
}
