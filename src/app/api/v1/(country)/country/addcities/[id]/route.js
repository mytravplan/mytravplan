 
import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import countriestModel from "@/model/countryModel";
import {  NextResponse } from "next/server"

DbConnect()

 

export async function PUT(req, { params }) {
    return handelAsyncErrors(async()=>{

        let { id } = params;
        let payload = await req.json();
        let { citiesRef } = payload;
    
        // Ensure countryRef is a non-empty array
        if (!Array.isArray(citiesRef) || citiesRef.length === 0) {
            return NextResponse.json({status:200, success: false, message: 'No countries provided' });
        }
    
        let filterId = { _id: id };
    
        // Retrieve the existing continent document
        let existingCountry = await countriestModel.findById(filterId);
    
        if (!existingCountry) {
            return NextResponse.json({status:200, success: false, message: 'country not found' });
        }
    
        // Get the current list of country IDs in the continent
        const existingCities = existingCountry.all_cities.map(String);  
    
        // Check for duplicates in the provided countryRef
        const duplicates = citiesRef.filter(id => existingCities.includes(id));
    
        if (duplicates.length > 0) {
            return NextResponse.json({
                status:200,
                success: false,
                message: 'duplicates countries found !please remove the duplicate entries then proceed to ahaed',
                duplicateEntries:duplicates
            });
        }
    
    
        await countriestModel.updateMany(
            { all_cities: { $in: citiesRef } },
            { $pull: { all_cities: { $in: citiesRef } } }
        );
    
        // Proceed with adding new country IDs to the continent
        let resp = await countriestModel.findByIdAndUpdate(
            filterId,
            { $addToSet: { all_cities: { $each: citiesRef } } },
            { new: true }
        );

    
        return NextResponse.json({status:201, success: true, message: 'cities added successfully',resp});
    })
}
