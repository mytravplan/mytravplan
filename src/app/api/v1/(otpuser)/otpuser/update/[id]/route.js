// // /api/v1/otpuser/update/[id]/route.js

// import { DbConnect } from "@/database/database";
// import { handelAsyncErrors } from "@/helpers/asyncErrors";
// import OtpUserModel from "@/model/otpUser";
// import { NextResponse } from "next/server";

// DbConnect();

// export async function PUT(req, { params }) {
//     return handelAsyncErrors(async () => {
//         const { id } = params;
//         const { registerusername, email, phoneNumber, role } = await req.json();

//         // Find the user by ID and update the details
//         const updatedUser = await OtpUserModel.findByIdAndUpdate(
//             id,
//             { registerusername, email, phoneNumber, role },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return NextResponse.json({ status: 404, message: "User not found" });
//         }

//         return NextResponse.json({ status: 200, message: "User updated successfully", user: updatedUser });
//     });
// }




import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import OtpUserModel from "@/model/otpUser";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;
        const { registerusername, email, phoneNumber, role, password } = await req.json();

        // Find the user by ID
        const user = await OtpUserModel.findById(id);

        if (!user) {
            return NextResponse.json({ status: 404, message: "User not found" });
        }

        // Update user fields
        user.registerusername = registerusername || user.registerusername;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.role = role || user.role;

        // Only update the password if it's provided and non-empty
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user details
        const updatedUser = await user.save();

        return NextResponse.json({ status: 200, message: "User updated successfully", user: updatedUser });
    });
}
