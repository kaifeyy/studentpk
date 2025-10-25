import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { ApiError } from './apiResponse';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${fileName}`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME || 'student-pakistan',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
    );

    // Return the public URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new ApiError(500, 'Failed to upload file');
  }
};

// Local file upload for development
const uploadLocally = async (file: Express.Multer.File): Promise<string> => {
  // In development, we'll just return a placeholder URL
  return `https://via.placeholder.com/300?text=${encodeURIComponent(file.originalname)}`;
};

// Use local upload in development, S3 in production
export const uploadFile = 
  process.env.NODE_ENV === 'production' ? uploadToS3 : uploadLocally;
