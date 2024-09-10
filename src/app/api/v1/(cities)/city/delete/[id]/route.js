import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import CitiesModel from "@/model/citiesModel";
import countriesModel from "@/model/countryModel";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";
DbConnect()


export async function DELETE(req, { params }) {

    return handelAsyncErrors(async () => {

        let { id } = params;

        if (!id) {
            return NextResponse.json({ success: false, message: 'please provide valid _id' });
        }

        let existingCity = await CitiesModel.findOne({ _id: id });
        if (!existingCity) {
            return NextResponse.json({ success: false, message: 'city is not exist! invalid city _id' });
        }

        let result = await CitiesModel.deleteOne({ _id: id });
        if (!result.deletedCount) {
            return NextResponse.json({ success: false, message: 'city not found' });
        }

        await PackagesModel.updateMany(
            { city_id: id },
            { $unset: { city_id: '' } }
        );

        await countriesModel.updateMany(
            { all_cities: id },
            { $pull: { all_cities: id } }
        );

        return NextResponse.json({ success: true, message: 'City deleted successfully', result });
    });
}