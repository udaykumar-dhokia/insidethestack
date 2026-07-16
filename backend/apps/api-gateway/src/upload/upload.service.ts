import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bufferToStream = require('buffer-to-stream');

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'insidethestack' },
        (error, result) => {
          if (error)
            return reject(
              new InternalServerErrorException('Failed to upload image'),
            );
          if (result)
            resolve({ url: result.secure_url, public_id: result.public_id });
        },
      );
      bufferToStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }

  async cleanupImages(publicIds: string[]): Promise<void> {
    for (const id of publicIds) {
      await this.deleteImage(id);
    }
  }
}
