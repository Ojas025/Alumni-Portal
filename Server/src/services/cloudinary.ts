// Import cloudinary
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import APIError from '../utils/APIError';

// Config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dd16ucgu6',
    api_key: process.env.CLOUDINARY_API_KEY || '473478963351831',
    api_secret: process.env.CLOUDINARY_API_SECRET || '8XAIJR9XQ6Ef6NiEV018JKastYU',
});

// The file uploads is to be performed in 2 steps:
// 1.Upload file to the server -> Local storage using multer
// 2.Fetch file from Local storage and upload it to cloudinary
// Delete file locally
const uploadFileToCloudinary = async (localFilePath: string) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        )

    
        console.log("File uploaded on Cloudinary");
        fs.unlinkSync(localFilePath);
        return response;
    } 
    catch (error) {
        // Delete the file from local storage
        console.error('Error uploading file', error);
        fs.unlinkSync(localFilePath);
    }
}

const deleteFileFromCloudinary = async (publicId: string, resource_type = "image") => {
    if (!publicId) return null;

    try {
        console.log('test');
        const response = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: resource_type
            }
        );

        console.log("File delete from cloudinary");
        return response;
    }
    catch(error){
        console.error("Error deleting file", error);
    }
}

export { 
    uploadFileToCloudinary,
    deleteFileFromCloudinary
}