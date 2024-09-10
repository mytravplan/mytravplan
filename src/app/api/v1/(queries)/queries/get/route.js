 
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import ContactModel from "@/model/userModel";

import { NextResponse } from "next/server";

export async function GET(req){
    return handelAsyncErrors(async()=>{
         let {page,limit,skip}=getPaginationParams(req)
    
        let result=await ContactModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip)
        let totalResults=await ContactModel.countDocuments()
        return NextResponse.json({status:200,totalResults,result,page,limit})

    })
}