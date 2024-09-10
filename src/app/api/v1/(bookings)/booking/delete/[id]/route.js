import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import BookingModel from "@/model/bookingModel";
import { NextResponse } from "next/server";
DbConnect()
export async function DELETE(req,{params}){
    return handelAsyncErrors(async()=>{

        let {id}=params
        let existingUser=await BookingModel.findById({_id:id})
    
        if(!existingUser){
            return NextResponse.json({status:404,success:false,message:'missing credentials! please provide valid id'})
        }

        let result=await BookingModel.deleteOne({_id:id})
    
        return NextResponse.json({status:200,result})
    })
}