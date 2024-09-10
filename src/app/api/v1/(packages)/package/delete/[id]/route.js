import { DbConnect } from "@/database/database"
import CitiesModel from "@/model/citiesModel"
import PackagesModel from "@/model/packagesModel"
import { NextResponse } from "next/server"
DbConnect()
export async function DELETE(req,{params}){
    let {id}=params
    try {
        let findById=await PackagesModel.findById({_id:id})
        if(!findById){
            return NextResponse.json({success:false,message:'missing credential'})
        }
        let result=await PackagesModel.deleteOne({_id:id})
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