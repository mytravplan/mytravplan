import { DbConnect } from "@/database/database"
import { handelAsyncErrors } from "@/helpers/asyncErrors"
import SliderModel from "@/model/slider"
import { NextResponse } from "next/server"

 
 DbConnect()
export async function DELETE(req,{params}) {
    let {id}=params

    return handelAsyncErrors(async () => {
  
    let result=await SliderModel.findOne({_id:id})
    if(!result){
        return NextResponse.json({success:false,message:'please provide valid id'})
    }
    let resp=await SliderModel.deleteOne({_id:id})
    return NextResponse.json({ status: 201, success: true, resp });
    })
}

