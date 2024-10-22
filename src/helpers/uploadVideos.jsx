import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function HandleVideoUpload(file) {
    const ALLOWED_FILE_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
    const MAX_FILE_SIZE = 300 * 1024 * 1024;  // Increase to 300 MB
    const UPLOADS_DIR = path.join(process.cwd(), 'public', 'videos');  

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'File size exceeds 300 MB limit' });
    }

    const bufferData = await file.arrayBuffer();
    const bufferObject = Buffer.from(bufferData);
    const sanitizedFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase();
    const filePath = path.join(UPLOADS_DIR, sanitizedFileName);

    // Check if file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, message: 'Unsupported file type' });
    }

    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(filePath, bufferObject);

    const videoUrl = `/videos/${sanitizedFileName}`;

    return {
        videoUrl,
    };
}
