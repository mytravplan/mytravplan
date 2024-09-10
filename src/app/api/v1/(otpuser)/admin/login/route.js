import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

DbConnect();

export async function POST(req) {
  return handelAsyncErrors(async () => {
    let payload = await req.json();
    let { email, password } = payload;


    if (!email && !password) {
      return NextResponse.json({ status: 200, success:false, message: 'email is required' })
    }

    let user = await OtpUserModel.findOne({ email: email })
    if (!user) {
      return NextResponse.json({ status: 200, success:false, message: 'provide valid email' })
    }


    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ status: 200,success:false, message: 'please provide valid password' })
    }

    user = user.toObject()
    delete user.password

    return NextResponse.json({ status: 200,success:true, message: 'logged in successfully', user })

  });
}
