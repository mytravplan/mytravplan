import { DbConnect } from "@/database/database";
import privacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";
DbConnect()
export async function GET(req,{params}) {
    let {id}=params
    try {
      const result = await privacyPolicy.findOne({_id:id});  
      if(!result){
        return NextResponse.json({status:200,message:'please provide valid credentials'})
      }
        
      return NextResponse.json({status:200,result})

    } catch (error) {
      return NextResponse.json({ error: "Failed to retrieve data", details: error.message }, { status: 500 });
    }
  }