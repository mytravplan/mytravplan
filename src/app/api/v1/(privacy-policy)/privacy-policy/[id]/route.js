import { DbConnect } from "@/database/database";
import PrivacyPolicy from "@/model/privacyPolicy";
import { NextResponse } from "next/server";


DbConnect()

// GET privacy policy section by ID
export async function GET(request, { params }) {
    let {id}=params
  
  try {
    const result = await PrivacyPolicy.findOne({_id:id});
    if (!result) return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    return NextResponse.json( {result,status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

// DELETE privacy policy section by ID
export async function DELETE(request, { params }) {
    let {id}=params
    console.log(id)
  try {
    const result = await PrivacyPolicy.findOne({_id:id});
    if (!result) return NextResponse.json({ error: 'Policy not found' , status: 404 });
    let data=await PrivacyPolicy.deleteOne({_id:id})
    return NextResponse.json({ message: 'Policy deleted successfully', data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete policy',status: 500 });
  }
}

export async function PUT(request, { params }) {
  let { id } = params; // Extracting the ID from params
  
  try {
    // Parse the incoming JSON body using the correct `request` object
    const payload = await request.json(); 

    // Check if the privacy policy exists with the given ID
    const existingPrivacyPolicy = await PrivacyPolicy.findById(id);
    if (!existingPrivacyPolicy) {
      return NextResponse.json({
        status: 404, 
        message: 'Please provide valid credentials'
      });
    }

    // Update the privacydata field if it exists in the payload, otherwise retain the existing data
    existingPrivacyPolicy.privacydata = payload.privacydata || existingPrivacyPolicy.privacydata;

    // Save the updated privacy policy document
    const result = await existingPrivacyPolicy.save();

    // Return success response with the updated policy data
    return NextResponse.json({
      message: 'Content updated successfully',
      status: 200,
      result,
    });

  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

