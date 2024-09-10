 
import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";
import {  NextResponse } from "next/server"

DbConnect()

 

export async function PUT(req, { params }) {

    return handelAsyncErrors(async()=>{
        let { id } = params;
        let payload = await req.json();
        let { packagesRef } = payload;
    
        // Ensure countryRef is a non-empty array
        if (!Array.isArray(packagesRef) || packagesRef.length === 0) {
            return NextResponse.json({status:404, success: false, message: 'please provide valid ref to packages' });
        }
    
        let filterId = { _id: id };
    
        // Retrieve the existing continent document
        let existingCities = await CitiesModel.findById(filterId);
    
        if (!existingCities) {
            return NextResponse.json({status:404, success: false, message: 'missing credentials! city not found' });
        }
    
        // Get the current list of country IDs in the continent
        const existingPackages = existingCities.all_packages.map(String);  
    
        // Check for duplicates in the provided countryRef
        const duplicates = packagesRef.filter(id => existingPackages.includes(id));
    
        if (duplicates.length > 0) {
            return NextResponse.json({
                status:404,
                success: false,
                message: 'please see below the dublicate entries and removes all after that proceed to add cities',
                duplicateEntries:duplicates
            });
        }
    
        await CitiesModel.updateMany(
            { all_packages: { $in: packagesRef } },
            { $pull: { all_packages: { $in: packagesRef } } }
        );
    
        // Proceed with adding new country IDs to the continent
        let resp = await CitiesModel.findByIdAndUpdate(
            filterId,
            { $addToSet: { all_packages: { $each: packagesRef } } },
            { new: true }
        );
    
        return NextResponse.json({status:201, success: true, message: 'packages added successfully'});
    })
    
        
      
     
}
