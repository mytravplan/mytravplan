import { DbConnect } from '@/database/database';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { getPaginationParams } from '@/helpers/paginations';
import continentModel from '@/model/continentModel';
import { NextResponse } from 'next/server';
// import cache from 'memory-cache';

// Ensure database connection is established
DbConnect();

export async function GET(req) {
  // const cacheKey = 'continentModel';  
  // const cacheTTL = 10 * 60 * 1000;  
  
  // Check if data is cached
  // const cachedData = cache.get(cacheKey);
  // if (cachedData) {
  
  //   return NextResponse.json(cachedData);
  // }

  // Fetch and process data if not cached
  return handelAsyncErrors(async () => {
    const { page, limit, skip } = getPaginationParams(req);

    // Fetch continents with nested population
    const continents = await continentModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'all_countries',
        populate: {
          path: 'all_cities',
          populate: {
            path: 'all_packages',
          },
        },
      })
      .limit(limit)
      .skip(skip)
      .exec();

    // Count total documents
    const totalResults = await continentModel.countDocuments();

    // Process and map results
    const result = continents.map((continent) => ({
      _id: continent._id,
      images: continent.images,
      title: continent.title,
      description: continent.description,
      slug: continent.slug,
      countries: continent.all_countries.map((country) => ({
        _id: country._id,
        images: country.images,
        title: country.title,
        description: country.description,
        slug: country.slug,
        cities: country.all_cities.map((city) => ({
          _id: city._id,
          city_name: city.title,
          city_packages_count: city.all_packages.length,
        })),
        totalCities: country.all_cities.length,
      })),
      total_countries: continent.all_countries.length,
    }));

    // Cache the result
    // cache.put(cacheKey, { status: 200, success: true, totalResults, result, page, limit }, cacheTTL);

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
