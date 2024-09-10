import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
 
import BlogModel from "@/model/blogModel";
import { NextResponse } from "next/server";
DbConnect()
export async function DELETE(req,{params}){
    let {id}=params
    return handelAsyncErrors(async()=>{
       let isValidId=await BlogModel.findById({_id:id})
       if(!isValidId){
        return NextResponse.json({status:200,success:false,message:'missing credentials! please provide valid id'})
       }
       console.log(isValidId)
        let result=await BlogModel.deleteOne({_id:id})
        
        return NextResponse.json({status:200,success:true,message:'blog deleted successfully',result})
    })
}