import { DbConnect } from "@/database/database";
import { NextResponse } from "next/server";
import { getPaginationParams } from "@/helpers/paginations";
import countriesModel from "@/model/countryModel";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async()=>{
        let { slug } = params;
        let { page, limit, skip } = getPaginationParams(req);
    
        // Fetch the country by slug and populate all cities and their packages
        const country = await countriesModel.findOne({ slug: slug }).sort({ createdAt: -1 }).populate({
            path: 'all_cities',
            populate: {
                path: 'all_packages',
            },
        }).exec();
    
        if (!country) {
            return NextResponse.json({ status: 404, success: false, message: 'Country not found! Please provide a valid slug.' });
        }
    
        // Get the total count of cities within the country
        const totalResults = await countriesModel.aggregate([
            { $match: { slug } },
            { $unwind: '$all_cities' },
            { $group: { _id: '$slug', total: { $sum: 1 } } }
        ]).then(results => results[0]?.total || 0);
    
        // Get the paginated cities
        const paginatedCities = country.all_cities.slice(skip, skip + limit);

        const countryResult={
            _id: country._id,
            images: country.images,
            title: country.title,
            description: country.description,
            continent_id: country.continent_id,
            slug: country.slug,
            sco_title:country.sco_title,
            sco_description:country.sco_description,
            sco_host_url:country.sco_host_url,
        }
    
        // Map the result to include details of cities and packages
        const result = paginatedCities.map(city => ({
            _id: city._id,
            title: city.title,
            images: city.images,
            description: city.description,
            slug: city.slug,
            city_packages_count: city.all_packages.length,
        }));
    
        // Return the cities array directly in the response
        return NextResponse.json({ status: 200, success: true, totalResults, page, limit, countryResult,result });
    })
    
}
