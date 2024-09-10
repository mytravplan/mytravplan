import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import ContactModel from "@/model/userModel";
import { NextResponse } from "next/server";
DbConnect()
export async function DELETE(req,{params}){
    return handelAsyncErrors(async()=>{

        let {id}=params
        let existingUser=await ContactModel.findById({_id:id})
    
        if(!existingUser){
            return NextResponse.json({status:404,success:false,message:'missing credentials! please provide valid id'})
        }

        let result=await ContactModel.deleteOne({_id:id})
    
        return NextResponse.json({status:200,result})
    })
}