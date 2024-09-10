import { handelAsyncErrors } from "@/helpers/asyncErrors";
import FlightModel from "@/model/fligthModel";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  return handelAsyncErrors(async () => {
    let { id } = params;
    let existingFlight = await FlightModel.findById(id);

    if (!existingFlight) {
      return NextResponse.json(
        { status: 404, success: false, message: 'Flight query not found!' },
        { status: 404 }
      );
    }

    await FlightModel.deleteOne({ _id: id });

    return NextResponse.json(
      { status: 200, success: true, message: 'Flight query deleted successfully' },
      { status: 200 }
    );
  });
}
