import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import VideosModel from "@/model/videoModel";
import {  NextResponse } from "next/server";

DbConnect()
export async function DELETE(req, { params }) {
    const { id } = params;

    return handelAsyncErrors(async () => {
        let exisVideo=await VideosModel.findOne({_id:id})
        if(!exisVideo){
            return NextResponse.json({success:false, status:200 ,message:'please provide valid credentials'})
        }

        let result=await VideosModel.deleteOne({_id:id})

        return NextResponse.json({success:true,result,message:'video deleted successfully'}) 
    });
}
