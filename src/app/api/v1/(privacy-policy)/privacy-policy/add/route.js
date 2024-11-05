import { DbConnect } from "@/database/database";
import privacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";

DbConnect();

export async function POST(req) {
  try {
    
    const formData = await req.formData();
    
    // Extracting data from FormData
    const sections = [];
    
    // Assuming you are submitting multiple sections with the keys as `title[]` and `description[]`
    const titles = JSON.parse(formData.getAll('title'));
    const descriptions = JSON.parse(formData.getAll('description'));

    // Combine titles and descriptions into the format needed for the model
    for (let i = 0; i < titles.length; i++) {
      sections.push({
        title: titles[i],
        description: descriptions[i],
      });
    }

    // Create a new instance of the privacy policy with the sections array
    const result = new privacyPolicy({ privacySections: sections });
    await result.save();
    
    return NextResponse.json({ message: "Data saved successfully", status: 201, result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data", details: error.message }, { status: 500 });
  }
}
