import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async function(localfilePath){
    try {
        const res = await cloudinary.uploader.upload(localfilePath,
            {
                resource_type: "auto"
            }
        )
        console.log(`${localfilePath} is uploaded on cloudinary | URL: ${res.url}`);
        return res;
    } catch (error) {
        fs.unlinkSync(localfilePath);
        console.log(`Error on uploading...`);
        return null;
    }
}

export {uploadToCloudinary}