import {S3Client} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT || 'http://minio:9000',
    region: process.env.MINIO_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'shop',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'securepassword123',
    },
    forcePathStyle: true,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'uploads';

export {s3Client, BUCKET_NAME};