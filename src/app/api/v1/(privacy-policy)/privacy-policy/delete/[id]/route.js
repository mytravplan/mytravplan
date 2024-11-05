import { DbConnect } from "@/database/database";
import privacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";
DbConnect()
export async function DELETE(req,{params}) {
  let {id}=params
    try {
      const isRecord = await privacyPolicy.findOne({_id:id});  
      if(!isRecord){
        return NextResponse.json({status:200,message:'please provide valid credentials'})
      }
      let result=await privacyPolicy.deleteOne({_id:id})
      return NextResponse.json({status:200,message:'items delete successfully', result });
    } catch (error) {
      return NextResponse.json({ error: "Failed to retrieve data", details: error.message }, { status: 500 });
    }
  }