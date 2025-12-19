import {s3Client, BUCKET_NAME} from '../utils/s3Client.js';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {randomUUID} from 'crypto';
import {extname} from 'path';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:9000';

export class UploadController {
    /**
     * Upload product image to MiniO.
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    static async uploadImage(req, res) {
        try {
            console.log('[UPLOAD] req.cookies:', req.cookies);
            console.log('[UPLOAD] req.user:', req.user);
            if (!req.file) {
                return res.status(400).json({message: 'No file uploaded'});
            }

            const file = req.file;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({message: 'Invalid file type. Only images allowed.'});
            }

            const ext = extname(file.originalname).toLowerCase();
            const fileName = `${Date.now()}_${randomUUID()}${ext}`;
            const key = `products/${fileName}`;

            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            });

            await s3Client.send(command);

            const publicUrl = `${FRONTEND_URL}/uploads/${key}`;

            return res.status(201).json({
                url: publicUrl,
                key,
            });
        } catch (err) {
            console.error('[UPLOAD ERROR]', err);
            return res.status(500).json({message: 'Upload failed', error: err.message});
        }
    }
}