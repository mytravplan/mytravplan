import { DbConnect } from '@/database/database'
import { HandleFileUpload } from '@/helpers/uploadFiles'
import Transfer from '@/model/TransferModel'
import { NextResponse } from 'next/server'
 

export async function POST(request) {
    try {
        await DbConnect()

        const formData = await request.formData()
        const transferImageFile = formData.get('transfer_image')
        const galleryFiles = formData.getAll('transfer_galleries')

        const rawTitle = formData.get('transfer_title')
        const rawSlug = formData.get('transfer_slug')
        const transfer_price = formData.get('transfer_price')
        const rawOverviewDesc = formData.get('transfer_overview_description')

        if (!transferImageFile || !(transferImageFile instanceof File)) {
            return NextResponse.json(
                { status: 400, success: false, message: 'Missing required field: transfer_image.' },

            )
        }
        if (!rawTitle || typeof rawTitle !== 'string' || rawTitle.trim() === '') {
            return NextResponse.json(
                { status: 400, success: false, message: 'Missing required field: transfer_title.' },

            )
        }
        const transferTitle = rawTitle.trim()

        const savedMain = await HandleFileUpload(transferImageFile)
        const mainFileName = savedMain.name

        const galleryFileNames = []
        if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
            for (const fileEntry of galleryFiles) {
                if (fileEntry instanceof File) {
                    const saved = await HandleFileUpload(fileEntry)
                    galleryFileNames.push(saved.name)
                }
            }
        }

        const newTransferData = {
            transfer_image: mainFileName,
            transfer_title: transferTitle,
        }
        if (galleryFileNames.length > 0) {
            newTransferData.transfer_galleries = galleryFileNames
        }
        if (rawSlug && typeof rawSlug === 'string' && rawSlug.trim() !== '') {
            newTransferData.transfer_slug = rawSlug.trim()
        }
        if (transfer_price) {
            newTransferData.transfer_price = transfer_price
        }
        if (rawOverviewDesc && typeof rawOverviewDesc === 'string') {
            newTransferData.transfer_overview_description = rawOverviewDesc.trim()
        }

        const transfer = await Transfer.create(newTransferData)
        return NextResponse.json({message:'created successfully',status: 201,transfer })
    } catch (error) {
        console.error('POST /api/transfers error:', error)
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { status: 422, success: false, message: error.message },

            )
        }
        return NextResponse.json(
            { status: 500, success: false, message: 'Internal server error.' },

        )
    }
}
