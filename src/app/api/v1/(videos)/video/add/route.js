import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleVideoUpload } from "@/helpers/uploadVideos";
import VideosModel from "@/model/videoModel";
import { NextResponse } from "next/server";

DbConnect() 

export async function POST(req) {
    return handelAsyncErrors(async () => {
        try {
            const formData = await req.formData();
            const host = req.headers.get('host');
            const name = formData.get('name');
            const description = formData.get('description');
            const file = formData.get('video');

            
            if (!name || !description || !file) {
                return NextResponse.json(
                    { success: false, message: 'All fields are required' },
                    { status: 400 }
                );
            }

       
            const { videoUrl } = await HandleVideoUpload(file,host);

           
            const newVideo = new VideosModel({
                name,
                description,
                videoUrl,
            });

            await newVideo.save();

            return NextResponse.json({
                success: true,
                message: 'Video added successfully',
                video: newVideo,
            }, { status: 201 });
        } catch (error) {
            console.error('Error in adding video:', error);
            return NextResponse.json(
                { success: false, message: 'Internal server error' },
                { status: 500 }
            );
        }
    });
}
