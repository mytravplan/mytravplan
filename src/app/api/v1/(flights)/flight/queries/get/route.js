 
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import FlightModel from "@/model/fligthModel";
import { NextResponse } from "next/server";

export async function GET(req){
    return handelAsyncErrors(async()=>{
         let {page,limit,skip}=getPaginationParams(req)
    
        let result=await FlightModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip)
        let totalResults=await FlightModel.countDocuments()
        return NextResponse.json({status:200,totalResults,result,page,limit})

    })
}