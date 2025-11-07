import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    secure: true,
    cloud_name: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'dog-spotting' },
            (error, uploadResult) => {
                if (error) reject(error)
                resolve(uploadResult)
            }
        ).end(fileBuffer)
    })
}

export { cloudinary, uploadBuffer } 