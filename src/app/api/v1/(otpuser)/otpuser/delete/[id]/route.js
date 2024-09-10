// /api/v1/otpuser/delete/[id]/route.js

import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";

DbConnect();

export async function DELETE(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params; // Extract the user ID from the request parameters

        // Find the user by ID and delete the user
        const user = await OtpUserModel.findByIdAndDelete(id);

        // If the user is not found, return a 404 response
        if (!user) {
            return NextResponse.json({ status: 404, message: "User not found" });
        }

        // If the user is successfully deleted, return a success response
        return NextResponse.json({ status: 200, message: "User deleted successfully" });
    });
}
