// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true, // Use HTTPS
    });
    console.log("Cloudinary configured successfully.");
};

// Export the configuration function and the cloudinary instance
export { configureCloudinary, cloudinary };

// Note: Ensure these three environment variables are set in your .env file!