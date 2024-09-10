import { DbConnect } from "@/database/database";
import CitiesModel from "@/model/citiesModel";
import PackagesModel from "@/model/packagesModel";
import { NextResponse } from "next/server";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

export async function GET(req) {
    try {
        await DbConnect();

        // Fetch all cities
        const cities = await CitiesModel.find().exec();
        if (cities.length === 0) {
            return NextResponse.json({
                status: 404,
                success: false,
                message: "No cities found.",
            });
        }

        // Fetch and sort packages for each city, only getting the lowest priced package
        const citiesWithLowestPrices = await Promise.all(cities.map(async (city) => {
            const packages = await PackagesModel.find({ city_id: city._id })
                .sort({ package_price: 1 }) // Sort packages by price in ascending order
                .limit(1) // Get only the lowest priced package
                .exec();

            return {
                city,
                lowestPricedPackage: packages.length ? packages[0] : null,
                lowestPrice: packages.length ? packages[0].package_price : Infinity,
            };
        }));

        // Sort cities based on the lowest price of their packages
        citiesWithLowestPrices.sort((a, b) => a.lowestPrice - b.lowestPrice);

        // Format the result
        const result = citiesWithLowestPrices.map(({ city, lowestPricedPackage }) => ({
            _id: city._id,
            images: city.images,
            title: city.title,
            description: city.description,
            slug: city.slug,
            package: lowestPricedPackage ? {
                _id: lowestPricedPackage._id,
                title: lowestPricedPackage.title,
                price: lowestPricedPackage.package_price,
                discounted_price: lowestPricedPackage.package_discounted_price,
            } : null,
            packagesCount: lowestPricedPackage ? 1 : 0
        }));

        return NextResponse.json({ status: 200, success: true, result });
    } catch (error) {
        console.error("Error fetching cities with lowest prices:", error);
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Internal server error.",
        });
    }
}
