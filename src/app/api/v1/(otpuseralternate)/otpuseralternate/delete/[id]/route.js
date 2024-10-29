
import { DbConnect } from "@/database/database"
import OtpUserAlternateModel from "@/model/otpUserAlternate"
import { NextResponse } from "next/server"



DbConnect()

export async function DELETE(req, { params }) {
    let { id } = params
    let isExist = await OtpUserAlternateModel.findOne({ _id: id })
    if (!isExist) {
        return NextResponse.json({ status: 200, message: 'please provide valid  id' })
    }
    let result = await OtpUserAlternateModel.deleteOne({ _id: id })
    return NextResponse.json({ status: 200, message: 'item deleted successfully', result })
} 