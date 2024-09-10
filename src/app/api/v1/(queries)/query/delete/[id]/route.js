import { handelAsyncErrors } from "@/helpers/asyncErrors";
import ContactModel from "@/model/userModel";

import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  return handelAsyncErrors(async () => {
    let { id } = params;
    let existingContact = await ContactModel.findById(id);

    if (!existingContact) {
      return NextResponse.json(
        { status: 404, success: false, message: 'contact query not found!' },
        { status: 404 }
      );
    }

    await ContactModel.deleteOne({ _id: id });

    return NextResponse.json(
      { status: 200, success: true, message: 'contact query deleted successfully' },
      { status: 200 }
    );
  });
}
