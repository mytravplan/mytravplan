 
import { DbConnect } from "@/database/database";
import privacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req,{params}) {
    let {id}=params
  try {
    
    const resp = await req.json();

    

 
    const existingPolicy = await privacyPolicy.findOne({_id:id});

    if (!existingPolicy) {
      return NextResponse.json({ error: "please provide valid credentials" }, { status: 404 });
    }

    existingPolicy.sections = resp;

 
    await existingPolicy.save();

 
    return NextResponse.json({ message: "Data updated successfully", status: 200, result: existingPolicy });
  } catch (error) {
    // Handle errors and return a failure response
    return NextResponse.json({ error: "Failed to update data", details: error.message }, { status: 500 });
  }
}
