import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import FooterModel from "@/model/footerModel";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
  return handelAsyncErrors(async () => {
    try {
      const formData = await req.formData();
      const address = formData.get("address");
      const phoneNumbers = JSON.parse(formData.get("phoneNumbers"));
      const emailAddresses = JSON.parse(formData.get("emailAddresses"));
      const socialIcons = JSON.parse(formData.get("socialIcons"));

    

      if (!address || !phoneNumbers || !emailAddresses || !socialIcons) {
        return NextResponse.json(
          { success: false, message: 'Invalid data provided' },
          { status: 400 }
        );
      }

      const result = new FooterModel({
        address,
        phoneNumbers,
        emailAddresses,
        socialIcons,
      });

      await result.save();

      return NextResponse.json(
        { status: 201, success: true, message: 'Content added successfully', result: [result] }
      );
    } catch (error) {
      console.error('Error in saving footer details:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}