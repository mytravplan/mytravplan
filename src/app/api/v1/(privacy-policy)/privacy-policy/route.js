import { DbConnect } from "@/database/database";
import PrivacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";

DbConnect();

// GET method to fetch all privacy policies in array format
export async function GET() {
  try {
    const result = await PrivacyPolicy.find({});
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch privacy policies' }, { status: 500 });
  }
}

// POST method to add a new privacy policy entry and return all policies
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const privacyDataArray = JSON.parse(formData.get("privacydata")); // Expecting "privacydata" to be a JSON array

    // Create a new PrivacyPolicy document with the parsed privacydata array
    const result = new PrivacyPolicy({ privacydata: privacyDataArray });
    await result.save();
    return NextResponse.json({ message: 'Content created successfully', result, status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create privacy policy' }, { status: 500 });
  }
}
