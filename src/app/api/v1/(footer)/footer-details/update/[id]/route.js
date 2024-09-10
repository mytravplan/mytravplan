import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import FooterModel from "@/model/footerModel";
import { NextResponse } from "next/server";

DbConnect();

export async function PUT(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;
        const payload = await req.json();

        // Find the existing footer
        const existingFooter = await FooterModel.findById(id);
        if (!existingFooter) {
            return NextResponse.json({ success: false, message: 'Footer not found' }, { status: 404 });
        }

        // Update fields if provided in the payload
        existingFooter.phoneNumbers = payload.phoneNumbers || existingFooter.phoneNumbers;
        existingFooter.emailAddresses = payload.emailAddresses || existingFooter.emailAddresses;
        existingFooter.address = payload.address || existingFooter.address;

        // Update socialIcons only if provided
        if (payload.socialIcons) {
            existingFooter.socialIcons = payload.socialIcons.map(icon => {
                return {
                    name: icon.name || existingFooter.socialIcons.find(existingIcon => existingIcon.iconUrl === icon.iconUrl)?.name,
                    iconUrl: icon.iconUrl || existingFooter.socialIcons.find(existingIcon => existingIcon.iconUrl === icon.iconUrl)?.iconUrl,
                    url: icon.url || existingFooter.socialIcons.find(existingIcon => existingIcon.iconUrl === icon.iconUrl)?.url,
                };
            });
        }

        // Save the updated document
        const result = await existingFooter.save();
        return NextResponse.json({ success: true, message: 'Content updated successfully', result }, { status: 200 });
    });
}
