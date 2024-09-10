import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";
DbConnect()
export async function GET(req) {
     return handelAsyncErrors(async()=>{
        let {page,limit,skip}=getPaginationParams(req)
    
        let result=await CategoryModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip)
        let totalResult=await CategoryModel.countDocuments()
    
        return NextResponse.json({status:200, success: true,totalResult,result,page,limit });
     })
     
}