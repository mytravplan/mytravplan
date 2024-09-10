// // // /api/v1/search/route.js

// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import continentModel from '@/model/continentModel';
// import countriesModel from '@/model/countryModel';
// import CitiesModel from '@/model/citiesModel';
// import PackagesModel from '@/model/packagesModel';
// import ActivitiesModel from '@/model/activitiesModel';
// import BlogModel from '@/model/blogModel';
// import { DbConnect } from '@/database/database';

// // Connect to MongoDB
// await DbConnect();

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get('query') || '';

//   const results = {
//     continents: [],
//     cities: [],
//     countries: [],
//     packages: [],
//     activities: [],
//     blogs: []
//   };

//   try {
//     // Check if query is valid
//     if (typeof query !== 'string' || query.trim() === '') {
//       return NextResponse.json({
//         status: 400,
//         success: false,
//         message: 'Invalid query parameter'
//       });
//     }

//     // Split query into words for matching
//     const words = query.split(/\s+/).map(word => new RegExp(word, 'i'));

//     // Define search filter that looks into title, slug, or description
//     const searchFilter = {
//       $or: [
//         { title: { $in: words } },
//         { slug: { $in: words } },
//         { description: { $in: words } }
//       ]
//     };

//     // Search across models
//     results.continents = await continentModel.find(searchFilter);
//     results.cities = await CitiesModel.find(searchFilter);
//     results.countries = await countriesModel.find(searchFilter);
//     results.packages = await PackagesModel.find(searchFilter);
//     results.activities = await ActivitiesModel.find(searchFilter);
//     results.blogs = await BlogModel.find(searchFilter);

//     return NextResponse.json({
//       status: 200,
//       success: true,
//       totalResults: Object.values(results).reduce((acc, array) => acc + array.length, 0),
//       results
//     });
//   } catch (error) {
//     console.error('Error fetching search results:', error);
//     return NextResponse.json({
//       status: 500,
//       success: false,
//       message: 'An error occurred while fetching search results'
//     });
//   }
// }




// /api/v1/search/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import continentModel from '@/model/continentModel';
import countriesModel from '@/model/countryModel';
import CitiesModel from '@/model/citiesModel';
import PackagesModel from '@/model/packagesModel';
import ActivitiesModel from '@/model/activitiesModel';
import BlogModel from '@/model/blogModel';
import { DbConnect } from '@/database/database';

// Connect to MongoDB
await DbConnect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let query = searchParams.get('query') || '';

  const results = {
    continents: [],
    cities: [],
    countries: [],
    packages: [],
    activities: [],
    blogs: []
  };

  try {
    // Check if query is valid
    if (typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({
        status: 400,
        success: false,
        message: 'Invalid query parameter'
      });
    }

    // Replace multiple hyphens with a single hyphen
    const sanitizedQuery = query.replace(/-+/g, '-');

    // Create regular expressions for exact and partial matches
    const exactSlugMatch = new RegExp(`^${sanitizedQuery}$`, 'i');
    const partialMatch = new RegExp(sanitizedQuery.split('-').join('.*'), 'i'); // Allow for more flexible matching

    // Define search filter that prioritizes exact slug match and allows for flexible partial matches
    const searchFilter = {
      $or: [
        { slug: exactSlugMatch },
        { slug: partialMatch },
        { title: partialMatch },
        { description: partialMatch }
      ]
    };

    // Search across models
    results.continents = await continentModel.find(searchFilter);
    results.cities = await CitiesModel.find(searchFilter);
    results.countries = await countriesModel.find(searchFilter);
    results.packages = await PackagesModel.find(searchFilter);
    results.activities = await ActivitiesModel.find(searchFilter);
    results.blogs = await BlogModel.find(searchFilter);

    return NextResponse.json({
      status: 200,
      success: true,
      totalResults: Object.values(results).reduce((acc, array) => acc + array.length, 0),
      results
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: 'An error occurred while fetching search results'
    });
  }
}
