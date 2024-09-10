import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

DbConnect();

export async function POST(req) {
  return handelAsyncErrors(async () => {
    let payload = await req.json();
    let { registerusername, email, password } = payload;

     
    let isEmail = await OtpUserModel.findOne({ email:email });
    if (isEmail) {
       return NextResponse.json({status:200,message:'email is already exist'})
    }

    // Register new admin
    let salt = await bcryptjs.genSalt(12);
    let hashPassword = await bcryptjs.hash(password, salt);

    let newAdmin = new OtpUserModel({
      registerusername: registerusername,
      email: email,
      password: hashPassword,
      role: 'admin'
    });

    await newAdmin.save();

    return NextResponse.json({ status: 201, message: 'Admin registered successfully', result: newAdmin });
  });
}
