import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function HandleFileUpload(file, host) {
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
    const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'File size exceeds 20 MB limit' });
    }

    const bufferData = await file.arrayBuffer();
    const bufferObject = Buffer.from(bufferData);
    const sanitizedFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase();
    const filePath = path.join(UPLOADS_DIR, sanitizedFileName);

    // Check if file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, message: 'Unsupported file type' });
    }

    // Ensure the uploads directory exists
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(filePath, bufferObject);

    // Construct the public URL of the uploaded file
    // const img_url = `http://${host}/uploads/${sanitizedFileName}`;

    return {
        name: sanitizedFileName,
        path: filePath,
        contentType: file.type,
        // img_url
    };
}
