import { v2 as cloudinary } from 'cloudinary';
import { config } from './env';
import { ApiError } from '../middlewares/errorHandler';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export function assertCloudinaryConfigured(): void {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    throw new ApiError(
      503,
      'FILE_STORAGE_NOT_CONFIGURED',
      'File storage is not configured. Add the Cloudinary credentials to server/.env before uploading documents.'
    );
  }
}

export { cloudinary };
