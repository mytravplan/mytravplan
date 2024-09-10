import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import { NextResponse } from "next/server";
import ActivitiesModel from "@/model/activitiesModel";

DbConnect();

export async function GET(req) {
    return handelAsyncErrors(async () => {
        let { page, limit, skip } = getPaginationParams(req);

        let data = await ActivitiesModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
        let result = data.map((e) => {
            // Calculate discount percentage
            let discount = 0;
            if (e.activity_price && e.activity_discounted_price) {
                discount = ((e.activity_price - e.activity_discounted_price) / e.activity_price) * 100;
            }

            return {
                _id: e._id,
                icon: e.icon,
                images: e.images,
                title: e.title,
                description: e.description,
                slug: e.slug,
                activity_price: e.activity_price,
                activity_discounted_price: e.activity_discounted_price,
                discount: discount.toFixed(2),
                city_id: e.city_id
            };
        });

        let totalResults = await ActivitiesModel.countDocuments();

        return NextResponse.json({
            status: 200,
            success: true,
            totalResults,
            result,
            page,
            limit
        });
    });
}
