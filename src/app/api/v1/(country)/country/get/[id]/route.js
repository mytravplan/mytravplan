import { DbConnect } from "@/database/database";

import { NextResponse } from "next/server";
import { getPaginationParams } from "@/helpers/paginations"; 
import mongoose from "mongoose";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import countriesModel from "@/model/countryModel";
 

DbConnect();

export async function GET(req, { params }) {

    return handelAsyncErrors(async()=>{

        let { id } = params;
        let { page, limit, skip } = getPaginationParams(req);
        // Fetch the country by id and populate all cities and their packages
        const country = await countriesModel.findOne({ _id: id }).populate({
            path: 'all_cities',
            populate: {
                path: 'all_packages',
            },
        }).exec();
    
        if (!country) {
            return NextResponse.json({status:404, success: false, message: 'country not found! please provide valid id' });
        }
    
        // Get the total count of cities within the country
        const totalResults = await countriesModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $unwind: '$all_cities' },
            { $group: { _id: '$_id', total: { $sum: 1 } } }
        ]).then(results => results[0]?.total || 0);
    
        // Get the paginated cities
        const paginatedCities = country.all_cities.slice(skip, skip + limit);
    
        // Map the result to include details of cities and packages
        const result = {
            _id: country._id,
            images: country.images,
            title: country.title,
            description: country.description,
            continent_id: country.continent_id,
            slug: country.slug,
            totalResults,
            cities: paginatedCities.map(city => ({
                _id: city._id,
                title: city.title,
                // Uncomment and complete this block if you need packages details
                packages: city.all_packages.map(pkg => ({
                    _id: pkg._id,
                    title: pkg.title,
                })),
                city_packages_count: city.all_packages.length,
            })),
            // total_cities: country.all_cities.length,
            page,
            limit
        };
    
        return NextResponse.json({status:200,success: true,  result });
    })
    
    // return handelAsyncErrors(async()=>{

    //     let { id } = params;
    //     if(!id){
    //         return NextResponse.json({ success: false, message:'invalid credentials _id not found' }); 
    //     }        
    //     let result=await countriesModel.findById({_id:id})
    //     if(!result){
    //         return NextResponse.json({ success: false, message:'invalid credentials _id not found' }); 
    //     }
    //     return NextResponse.json({status:200, success: true, result });  
    // })
    
}

