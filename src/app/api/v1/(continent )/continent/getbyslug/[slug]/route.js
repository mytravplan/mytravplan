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
        
        // Fetch the continent with its related countries, cities, and their packages
        const continent = await continentModel.findOne({ slug }).populate({
            path: 'all_countries',
            populate: {
                path: 'all_cities',
                populate: {
                    path: 'all_packages', // Fetch all packages in cities
                },
            },
        }).exec();

        // Check if the continent exists
        if (!continent) {
            return NextResponse.json({ status: 200, success: false, error: 'Continent not found' });
        }

        // Log the fetched continent data for debugging
        console.log("Fetched continent:", JSON.stringify(continent, null, 2));

        // Get the total count of countries within the continent
        const totalResults = continent.all_countries.length;

        // Get the paginated countries
        const countries = continent.all_countries.slice(skip, skip + limit);

        // Collect all packages from all countries and cities within the continent
        let allPackages = [];
        continent.all_countries.forEach(country => {
            country.all_cities.forEach(city => {
                allPackages.push(...city.all_packages);
            });
        });

        // Calculate the total number of packages
        const packageCount = allPackages.length;

        // Map continent details
        const continentResult = {
            _id: continent._id,
            images: continent.images,
            title: continent.title,
            description: continent.description,
            slug: continent.slug,
            sco_title: continent.sco_title,
            sco_description: continent.sco_description,
            sco_host_url: continent.sco_host_url,
        };

        // Map countries, cities, and packages to the desired format
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

        // Return both countries, cities, and packages in the response along with the total package count
        return NextResponse.json({
            status: 200,
            success: true,
            totalResults,
            packageCount, 
            continentResult,
            result,  
            packages: allPackages.map(pkg => ({
                _id: pkg._id,
                title: pkg.title,
                images: pkg.images,
                description: pkg.description,
                slug: pkg.slug,
                package_price: pkg.package_price,
                package_discounted_price: pkg.package_discounted_price,
                package_days: pkg.package_days,
                package_nights: pkg.package_nights,
            })),
            page,
            limit,
        });
    });
}
