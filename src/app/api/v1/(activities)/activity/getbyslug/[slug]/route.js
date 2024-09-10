import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import ActivitiesModel from "@/model/activitiesModel";

import { NextResponse } from "next/server";

DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async()=>{

        const { slug } = params;


        // Fetch the package and populate the necessary fields
        const result = await ActivitiesModel.findOne({slug:slug})
            .populate({
                path: 'city_id',
                populate: {
                    path: 'country_id',
                    populate: {
                        path: 'continent_id',
                    }
                }
            });

        if (!result) {
            return NextResponse.json({ status: 200, success: false, message: 'Package not found' });
        }

        // Prepare the formatted result with checks for null values
        const formattedResult = {
            _id: result._id,
            title: result.title,
            images:result.images,
            icon:result.icon,
            description: result.description,
            slug: result.slug,
            activity_price: result.activity_price,
            activity_discounted_price: result.activity_discounted_price,
            activity_overview: result.activity_overview,
            activity_top_summary: result.activity_top_summary,
            activity_galleries: result.activity_galleries,
            activity_under_continent: result.city_id && result.city_id.country_id && result.city_id.country_id.continent_id ? {
                _id: result.city_id.country_id.continent_id._id,
                title: result.city_id.country_id.continent_id.title,
                slug: result.city_id.country_id.continent_id.slug
            } : null,
            activity_under_country: result.city_id && result.city_id.country_id ? {
                _id: result.city_id.country_id._id,
                title: result.city_id.country_id.title,
                slug: result.city_id.country_id.slug
            } : null,
            activity_under_city: result.city_id ? {
                _id: result.city_id._id,
                title: result.city_id.title,
                slug: result.city_id.slug
            } : null
        };

        return NextResponse.json({ status: 200, success: true, result: [formattedResult] });
    })
     
}

