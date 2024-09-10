import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function HandleFileUpload(file) {
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
    const bufferData = await file.arrayBuffer();
    const bufferObject = Buffer.from(bufferData);
    const sanitizedFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase();
    const filePath = path.join(UPLOADS_DIR, sanitizedFileName);

    // Ensure directory exists
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(filePath, bufferObject);

    // Check if file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, message: 'Unsupported file type' });
    }

    // Construct the public URL of the uploaded file
    // const fileUrl = `http://${host}/uploads/${sanitizedFileName}`;

    return {
        name: sanitizedFileName,
        path: filePath,
        contentType: file.type,
       
    };
}
