import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import continentModel from "@/model/continentModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req, { params }) {

    return handelAsyncErrors(async()=>{
        const { id } = params;
        const { page, limit, skip } = getPaginationParams(req);

        // Fetch the continent with its related data, paginated
        const continent = await continentModel.findOne({ _id:id }).populate({
            path: 'all_countries',
            populate: {
                path: 'all_cities',
                populate: {
                    path: 'all_packages',
                },
            },
        }).exec();
    
        // Check if the continent exists
        if (!continent) {
            return NextResponse.json({status:200, success: false, error: 'continent not found' });
        }
        // Get the total count of countries within the continent
        const totalResults = await continentModel.aggregate([
            { $match: { _id:new mongoose.Types.ObjectId(id) } },
            { $unwind: '$all_countries' },
            { $group: { _id: '$_id', total: { $sum: 1 } } }
        ]).then(results => results[0]?.total || 0);
        // Get the paginated countries
        const countries = continent.all_countries.slice(skip, skip + limit);
    
        let result={
            _id: continent._id,
            images: continent.images,
            title: continent.title,  
            description: continent.description,  
            slug: continent.slug,
            countries:countries.map(country => ({
                _id: country._id,
                images: country.images,
                title: country.title,
                description: country.description,
                slug: country.slug,
                cities: country.all_cities.map(city => ({
                    _id: city._id,
                    city_name: city.title,
                    city_packages_count: city.all_packages.length,
                })),
                total_cities: country.all_cities.length,
            })),
        }

        return NextResponse.json({
            status:200,
            success: true,
            totalResults,
            result,
            page,
            limit,
        });
    })

    

    
     
}
