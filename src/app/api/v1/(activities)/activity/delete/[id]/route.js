import { DbConnect } from "@/database/database"
import ActivitiesModel from "@/model/activitiesModel"
import CitiesModel from "@/model/citiesModel"

import { NextResponse } from "next/server"
DbConnect()
export async function DELETE(req,{params}){
    let {id}=params
    try {
        let findById=await ActivitiesModel.findById({_id:id})
        if(!findById){
            return NextResponse.json({success:false,message:'missing credential'})
        }
        let result=await ActivitiesModel.deleteOne({_id:id})
        if(!result){
            return NextResponse.json({success:false,message:'result not found'})
        }
        await CitiesModel.updateMany(
            { all_packages: id },
            { $pull: { all_packages: id } }
        );
        return NextResponse.json({success:true,result})
    } catch (error) {
        return NextResponse.json({success:false,message:'internal server error'})
    }
    

    

}