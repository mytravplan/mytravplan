
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function HandleFileUpload(file) {
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ]
  const MAX_FILE_SIZE = 20 * 1024 * 1024 
  const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 20 MB limit')
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type: ' + file.type)
  }
  await mkdir(UPLOADS_DIR, { recursive: true })
  const bufferData = await file.arrayBuffer()
  const bufferObject = Buffer.from(bufferData)
  const sanitizedFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase()
  const filePath = path.join(UPLOADS_DIR, sanitizedFileName)
  await writeFile(filePath, bufferObject)
  return {
    name: sanitizedFileName,
    path: filePath,
    contentType: file.type,
  }
}
