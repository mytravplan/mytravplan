import { DbConnect } from "@/database/database";
import CitiesModel from "@/model/citiesModel";
import { NextResponse } from "next/server";
import { getPaginationParams } from "@/helpers/paginations";
import { handelAsyncErrors } from "@/helpers/asyncErrors";

DbConnect();

export async function GET(req) {
    return handelAsyncErrors(async () => {
        let { page, limit, skip } = getPaginationParams(req)
        const data = await CitiesModel.find()
            .populate('all_packages')
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
            
        const result = data.map(e => ({
            _id: e._id,
            images: e.images,
            title: e.title,
            description: e.description,
            slug: e.slug,
            packages: e.all_packages.map(pkg => ({
                _id: pkg._id,
                title: pkg.title,
            })),
            packagesCount: e.all_packages.length
        }));

        const totalResults = await CitiesModel.countDocuments();

        return NextResponse.json({status:200, success: true, totalResults, result, page, limit });
    })

}
