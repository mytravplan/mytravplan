import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import FooterModel from "@/model/footerModel";
import { NextResponse } from "next/server";

DbConnect();

export async function DELETE(req, { params }) {
    return handelAsyncErrors(async () => {
        const { id } = params;
        if (!id) {
            return NextResponse.json({status:200,success:false,message:'please provide valid id'});
        }
        const isFooter = await FooterModel.findOne({_id:id});
        if (!isFooter) {
            return NextResponse.json({status:200,success:false,message:'no content available in this reference is'});
        }
        let result=await FooterModel.deleteOne({_id:id})
        return NextResponse.json({status:200, success: true, message: 'Footer deleted successfully',result });
    });
}
