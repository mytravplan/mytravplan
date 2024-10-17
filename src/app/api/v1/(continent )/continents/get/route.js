import { DbConnect } from '@/database/database';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { getPaginationParams } from '@/helpers/paginations';
import continentModel from '@/model/continentModel';
import { NextResponse } from 'next/server';

// Ensure database connection is established
DbConnect();

export async function GET(req) {
    return handelAsyncErrors(async () => {
        const { page, limit, skip } = getPaginationParams(req);

        // Fetch continents with nested population
        const continents = await continentModel
            .find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'all_countries',
                populate: {
                    path: 'all_cities', // Ensure you have a cities field in country model if necessary
                    populate: {
                        path: 'all_packages', // Ensure you have a packages field in city model if necessary
                    },
                },
            })
            .limit(limit)
            .skip(skip)
            .exec();

             
             let cc=continents.map((continent)=>({
              countries:continent.all_countries.map((e)=>e._id)
               
            }))

            console.log(`dd`)
            console.log(cc)

        // Count total documents
        const totalResults = await continentModel.countDocuments();

        // Process and map results
        const result = continents.map((continent) => ({
            _id: continent._id,
            images: continent.images,
            title: continent.title,
            description: continent.description,
            slug: continent.slug,
            sco_title: continent.sco_title,
            sco_description: continent.sco_description,
            sco_host_url: continent.sco_host_url,
            countries: continent.all_countries.map((country) => ({
                _id: country._id,
                images: country.images,
                title: country.title,
                description: country.description,
                slug: country.slug,
                totalCities: country.all_cities.length,
            })),
            total_countries: continent.all_countries.length,
        }));

        

         

        // Return the response
        return NextResponse.json({
            status: 200,
            success: true,
            totalResults,
            result,
            page,
            limit,
        });
    });
}
