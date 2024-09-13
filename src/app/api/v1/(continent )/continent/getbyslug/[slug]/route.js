import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import continentModel from "@/model/continentModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req, { params }) {
    return handelAsyncErrors(async () => {
        const { slug } = params;
        const { page, limit, skip } = getPaginationParams(req);

        // Fetch the continent with its related countries, cities, and packages
        const continent = await continentModel.findOne({ slug }).populate({
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
            return NextResponse.json({ status: 200, success: false, error: 'Continent not found' });
        }

         

        // Get the total count of countries within the continent
        const totalResults = continent.all_countries.length;

        // Get the paginated countries
        const countries = continent.all_countries.slice(skip, skip + limit);

        // Map countries to desired format

        const continentResult={
            _id:continent._id,
            images:continent.images,
            title:continent.title,
            description:continent.description,
            slug:continent.slug,
            sco_title:continent.sco_title,
            sco_description:continent.sco_description,
            sco_host_url:continent.sco_host_url
        }
         
        const result = countries.map(country => ({
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
        }));

        return NextResponse.json({
            status: 200,
            success: true,
            totalResults,
            continentResult,
            result,
            page,
            limit,
        });
    });
}
