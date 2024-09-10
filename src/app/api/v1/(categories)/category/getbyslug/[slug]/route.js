import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect()
export async function GET(req,{params}) {
     return handelAsyncErrors(async()=>{
        let {slug}=params

        let isValidId=await CategoryModel.findOne({slug}).sort({ createdAt: -1 }) 
        if(!isValidId){
            return NextResponse.json({status:200,success:false,message:'missing credentials! please provide valid slug'})
        }

        let result=await CategoryModel.findOne({slug})
    
        return NextResponse.json({status:200, success: true,result });
     })
     
}