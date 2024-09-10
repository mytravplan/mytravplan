import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import countriestModel from "@/model/countryModel";
import { NextResponse } from "next/server";
DbConnect()
export async function GET(req){
    return handelAsyncErrors(async()=>{
        let {page,limit,skip}=getPaginationParams(req)
        let data=await countriestModel.find().populate({path:'all_cities',path: 'all_cities',
            populate: {
                path: 'all_packages',
            }}).limit(limit).sort({ createdAt: -1 }).skip(skip).exec()
    
             
    
        let result=data.map((e)=>({
            _id: e._id,      
            images: e.images,
            title: e.title,
            description: e.description,
            slug: e.slug,
            cities:e.all_cities.map((city)=>({
                _id: city._id,      
                title: city.title, 
                city_packages_count:city.all_packages.length
            })),
            total_cities:e.all_cities.length
        }))
        let totalResults=await countriestModel.countDocuments()
         
        return NextResponse.json({status:200,success:true,totalResults,result,page,limit})
    })
    
     
}
