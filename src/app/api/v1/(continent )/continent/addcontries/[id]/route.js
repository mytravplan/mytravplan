
import { DbConnect } from "@/database/database"
import { handelAsyncErrors } from "@/helpers/asyncErrors"
import continentModel from "@/model/continentModel"
import {  NextResponse } from "next/server"

DbConnect()

export async function PUT(req, { params }) {
    return handelAsyncErrors(async()=>{

        let { id } = params;
        let payload = await req.json();
        let { countryRef } = payload;
    
        // Ensure countryRef is a non-empty array
        if (!Array.isArray(countryRef) || countryRef.length === 0) {
            return NextResponse.json({status:200, success: false, message: 'please provide valid country ref' });
        }
    
        let filterId = { _id: id };
    
        // Retrieve the existing continent document
        let existingContinent = await continentModel.findById(filterId);
    
        if (!existingContinent) {
            return NextResponse.json({status:200, success: false, message: 'continent not found! please provide valid continet id' });
        }
    
        // Get the current list of country IDs in the continent
        const existingCountries = existingContinent.all_countries.map(String);  
    
        // Check for duplicates in the provided countryRef
        const duplicates = countryRef.filter(id => existingCountries.includes(id));
    
        if (duplicates.length > 0) {
            return NextResponse.json({
                status:404,
                success: false,
                message: 'duplicates countries found! please remove the duplicate entries then proceed to ahaed',
                duplicateEntries:duplicates
            });
        }
    
        // Proceed with adding new country IDs to the continent
        let result = await continentModel.findByIdAndUpdate(
            filterId,
            { $addToSet: { all_countries: { $each: countryRef } } },
            { new: true }
        );
    
        
    
        return NextResponse.json({status:201, success: true, message: 'countries added successfully',result});
    })
}
