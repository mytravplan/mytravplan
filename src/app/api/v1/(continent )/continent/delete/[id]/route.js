import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import continentModel from "@/model/continentModel";
import { NextResponse } from "next/server";

DbConnect();

export async function DELETE(req, { params }) {
    return handelAsyncErrors(async()=>{

        const { id } = params;
        if (!id) {
            return NextResponse.json({status:200, success: false, message: 'missing credentials! please provide valid id' });
        }
    
        // Find the continent by ID and populate all countries, cities, and packages
        const continent = await continentModel.findById(id).populate({
            path: 'all_countries',
            populate: {
                path: 'all_cities',
                populate: {
                    path: 'all_packages',
                },
            },
        }).exec();
    
        if (!continent) {
            return NextResponse.json({status:200, success: false, message: 'continent not found' });
        }
    
        // Check if there are any associated countries
        const hasCountries = continent.all_countries.length > 0;
    
        // Check if any country has associated cities
        const hasCities = continent.all_countries.some(country => country.all_cities.length > 0);
    
        // Check if any city has associated packages
        const hasPackages = continent.all_countries.some(country =>
            country.all_cities.some(city => city.all_packages.length > 0)
        );
    
    
    
        // If there are any associated countries, cities, or packages, do not delete
        if (hasCountries || hasCities || hasPackages) {
            return NextResponse.json({status:200, success: false, message: 'continent cannot be deleted because it has associated countries, cities, or packages' });
        }
    
        // Proceed with deletion
        const result = await continentModel.deleteOne({ _id: id });
    
        if (result.deletedCount === 0) {
            return NextResponse.json({status:200, success: false, message: 'continent not deleted' });
        }
    
        return NextResponse.json({status:200, success: true, message: 'continent deleted successfully' });
    })
    
     
}
