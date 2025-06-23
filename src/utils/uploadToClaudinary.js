import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';




cloudinary.v2.config({
    cloud_name:getEnvVar('CLOUD_NAME'),
    api_key:getEnvVar('API_KEY'),
    api_secret:getEnvVar('API_SECRET'),
})
export function uploadCloud(filePath) {
    return cloudinary.v2.uploader.upload(filePath);
} 