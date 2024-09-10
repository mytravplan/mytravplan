import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CategoryModel from "@/model/categoryModel";
import { NextResponse } from "next/server";

DbConnect()

export async function GET(req,{params}) {
     return handelAsyncErrors(async()=>{
        let {id}=params

        let isValidId=await CategoryModel.findById({_id:id})
        if(!isValidId){
            return NextResponse.json({status:200,success:false,message:'missing credentials! please provide valid id'})
        }
        let result=await CategoryModel.findOne({_id:id})
    
        return NextResponse.json({status:200, success: true,result });
     })
     
}