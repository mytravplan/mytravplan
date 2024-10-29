
import { DbConnect } from "@/database/database"
import { getPaginationParams } from "@/helpers/paginations"
import OtpUserAlternateModel from "@/model/otpUserAlternate"
import { NextResponse } from "next/server"
 


DbConnect()

export async function GET(req) {
    let {page,limit,skip}=getPaginationParams(req)
    let result=await OtpUserAlternateModel.find().skip(skip).limit(limit)
    let totalResults=await OtpUserAlternateModel.countDocuments()

    return NextResponse.json({ status: 200, totalResults,result,page,limit })

} 