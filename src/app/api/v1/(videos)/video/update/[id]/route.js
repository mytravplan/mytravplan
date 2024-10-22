import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { HandleVideoUpload } from "@/helpers/uploadVideos";
import VideosModel from "@/model/videoModel";
import { NextResponse } from "next/server";

DbConnect()
export async function PUT(req, { params }) {
    const { id } = params;

    return handelAsyncErrors(async () => {
        try {
            const host = req.headers.get('host');
            const formData = await req.formData();
            const name = formData.get('name');
            const description = formData.get('description');
            const file = formData.get('video');

            // Find the existing video
            const existingVideo = await VideosModel.findById(id);
            if (!existingVideo) {
                return NextResponse.json({ success: false, message: 'Video not found' }, { status: 404 });
            }

            // Update fields
            existingVideo.name = name || existingVideo.name;
            existingVideo.description = description || existingVideo.description;

            // Handle file upload if provided
            if (file) {
                const { videoUrl } = await HandleVideoUpload(file);
                existingVideo.videoUrl = videoUrl;
            }

            const updatedVideo = await existingVideo.save();

            return NextResponse.json({
                success: true,
                message: 'Video updated successfully',
                video: updatedVideo,
            }, { status: 200 });
        } catch (error) {
            console.error('Error in updating video:', error);
            return NextResponse.json(
                { success: false, message: 'Internal server error' },
                { status: 500 }
            );
        }
    });
}
