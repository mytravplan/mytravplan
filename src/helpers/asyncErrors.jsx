
import { NextResponse } from "next/server";

export const handelAsyncErrors = async (asyncFunction) => {
    try {
        return await asyncFunction();
    } catch (error) {
        return NextResponse.json({status:404,success:false,message: 'no result found! internal server error'})
    }
};
