import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req, { params }) {

    return handelAsyncErrors(async()=>{

        let { id } = params;
        if(!id){
            return NextResponse.json({ success: false, message:'invalid credentials _id not found' }); 
        }        
        let result=await CitiesModel.findById({_id:id})
        if(!result){
            return NextResponse.json({ success: false, message:'invalid credentials _id not found' }); 
        }
        return NextResponse.json({status:200, success: true, result });  
    })
    
}
