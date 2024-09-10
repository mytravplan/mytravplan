import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";
import continentModel from "@/model/continentModel";
import countriestModel from "@/model/countryModel";
import { NextResponse } from "next/server";
DbConnect()
export async function DELETE(req, { params }) {

    return handelAsyncErrors(async()=>{
        let { id } = params;
    
        if (!id) {
            return NextResponse.json({status:404, success: false, message: 'missing credentials! please provide valid id' });
        }
    
        let existingCountry = await countriestModel.findOne({ _id: id });
        if (!existingCountry) {
            return NextResponse.json({status:404, success: false, message: 'country is not exist'});
        }
    
        let result = await countriestModel.deleteOne({ _id: id });
        if (!result) {
            return NextResponse.json({status:404, success: false, message: 'please provide valid id'});
        }

        // if delete city parent country then delete this form the city
        await CitiesModel.updateMany(
            { country_id: id },
            { $unset: { country_id: "" } }
        );
    
        await continentModel.updateMany(
            { all_countries: id },
            { $pull: { all_countries: id } }
        );
    
        return NextResponse.json({status:200, success: true, message: 'country deleted successfully', result });
    })
}